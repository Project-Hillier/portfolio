import React, { useEffect, useRef, useState } from 'react';
import { Engine, Render, World, Bodies, Body, Runner, Events } from 'matter-js';

interface PhysicsSkillsProps {
  skills: Skill[];
  width?: number;  // Optional width prop
  height?: number; // Optional height prop
}

const PhysicsSkills: React.FC<PhysicsSkillsProps> = ({ 
  skills, 
  width = 800,   // Default width if not provided
  height = 600   // Default height if not provided
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const [isPhysicsActive, setIsPhysicsActive] = useState(false);
  const containerWidth = 800;
  const containerHeight = 800;  // Added container height
  const minBoxWidth = 80;
  const maxBoxWidth = 180;
  const boxHeight = 40;
  const padding = 20;

  // Function to split text into lines
  const splitTextIntoLines = (text: string, maxWidth: number, context: CanvasRenderingContext2D) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + " " + word).width;
      if (width < maxWidth - padding * 2) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Function to measure text and get box dimensions
  const getBoxDimensions = (skill: Skill, context: CanvasRenderingContext2D) => {
    const lines = splitTextIntoLines(skill.name, maxBoxWidth, context);
    const textWidth = Math.max(...lines.map(line => context.measureText(line).width));
    const width = Math.min(Math.max(textWidth + padding * 2, minBoxWidth), maxBoxWidth);
    return { width, lines };
  };

  // Function to calculate grid layout
  const calculateGridLayout = (skills: Skill[], context: CanvasRenderingContext2D) => {
    const boxes = skills.map(skill => ({
      skill,
      ...getBoxDimensions(skill, context)
    }));

    let currentX = padding;
    let currentY = padding;
    let maxHeightInRow = 0;
    const positions: { x: number; y: number; width: number; lines: string[] }[] = [];

    boxes.forEach((box) => {
      if (currentX + box.width + padding > containerWidth) {
        // Move to next row
        currentX = padding;
        currentY += maxHeightInRow + padding;
        maxHeightInRow = boxHeight;
      }

      positions.push({
        x: currentX + box.width / 2,
        y: currentY + boxHeight / 2,
        width: box.width,
        lines: box.lines
      });

      currentX += box.width + padding;
      maxHeightInRow = Math.max(maxHeightInRow, boxHeight);
    });

    return positions;
  };

  const createBox = (
    skill: Skill, 
    x: number, 
    y: number, 
    width: number, 
    lines: string[], 
    isStatic: boolean
  ) => {
    return Bodies.rectangle(x, y, width, boxHeight, {
      restitution: 0.8,
      friction: .18,
      frictionAir: 0.001,
      density: 0.001,
      isStatic,
      render: {
        fillStyle: '#FFFFFF',
        strokeStyle: '#000000',
        lineWidth: 1
      },
      label: skill.name,
      chamfer: { radius: 5 },
      plugin: { lines } // Store lines for rendering
    });
  };

  const createWalls = () => [
    // Bottom wall
    Bodies.rectangle(containerWidth/2, 590, containerWidth, 60, {
      isStatic: true,
      render: { 
        fillStyle: '#0F4C3A',  // Dark green
        strokeStyle: '#2D8A62', // Lighter green for border
        lineWidth: 2
      }
    }),
    // Left wall
    Bodies.rectangle(-10, 300, 60, 600, {
      isStatic: true,
      render: { 
        fillStyle: '#0F4C3A',
        strokeStyle: '#2D8A62',
        lineWidth: 2
      }
    }),
    // Right wall
    Bodies.rectangle(containerWidth + 10, 300, 60, 600, {
      isStatic: true,
      render: { 
        fillStyle: '#0F4C3A',
        strokeStyle: '#2D8A62',
        lineWidth: 2
      }
    })
  ];

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: 600,
        wireframes: false,
        background: 'transparent'  // Changed to transparent to show dark background
      }
    });
    renderRef.current = render;

    // Add walls
    World.add(engine.world, createWalls());

    // Calculate layout and create boxes
    const context = render.context;
    context.font = 'bold 14px Arial';
    const layout = calculateGridLayout(skills, context);

    skills.forEach((skill, i) => {
      const pos = layout[i];
      const box = createBox(
        skill,
        pos.x,
        pos.y,
        pos.width,
        pos.lines,
        true
      );
      World.add(engine.world, box);
    });

    // Text rendering
    Events.on(render, 'afterRender', () => {
      const context = render.context;
      context.font = 'bold 14px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#000000';

      engine.world.bodies.slice(3).forEach((body: Matter.Body & { plugin?: { lines: string[] } }) => {
        if (body.plugin?.lines) {
          context.save();
          context.translate(body.position.x, body.position.y);
          context.rotate(body.angle);

          const lineHeight = 18;
          const totalHeight = body.plugin.lines.length * lineHeight;
          const startY = -totalHeight / 2 + lineHeight / 2;

          body.plugin.lines.forEach((line: string, index: number) => {
            context.fillText(line, 0, startY + index * lineHeight);
          });

          context.restore();
        }
      });
    });

    Runner.run(Runner.create(), engine);
    Render.run(render);

    return () => {
      if (render) {
        Render.stop(render);
        render.canvas.remove();
      }
      if (engine) {
        // Safely clear the world
        const allBodies = engine.world.bodies;
        if (allBodies.length > 0) {
          World.clear(engine.world, false);
        }
        Engine.clear(engine);
      }
    };
  }, [skills]);

  const togglePhysics = () => {
    if (!engineRef.current || !renderRef.current) return;

    const engine = engineRef.current;
    const render = renderRef.current;
    const context = render.context;
    context.font = 'bold 14px Arial';
    const layout = calculateGridLayout(skills, context);

    // Safely remove existing boxes
    const existingBodies = engine.world.bodies.slice(3);
    if (existingBodies.length > 0) {
      World.remove(engine.world, existingBodies);
    }

    // Create new boxes
    if (!isPhysicsActive) {
      // Activate physics
      engine.gravity.y = 0.5;
      skills.forEach((skill, i) => {
        const pos = layout[i];
        if (pos) {  // Safety check
          const box = createBox(
            skill,
            pos.x,
            pos.y,
            pos.width,
            pos.lines,
            false  // not static
          );

          Body.setVelocity(box, {
            x: (Math.random() - 0.5) * 4,
            y: -2 * Math.random()
          });

          World.add(engine.world, box);
        }
      });
    } else {
      // Reset to static grid
      engine.gravity.y = 0;
      skills.forEach((skill, i) => {
        const pos = layout[i];
        if (pos) {  // Safety check
          const box = createBox(
            skill,
            pos.x,
            pos.y,
            pos.width,
            pos.lines,
            true  // static
          );
          World.add(engine.world, box);
        }
      });
    }

    setIsPhysicsActive(!isPhysicsActive);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={togglePhysics}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isPhysicsActive ? 'Reset Physics' : 'Start Physics'}
      </button>
      <div
        ref={sceneRef}
        className="border-2 border-[#2D8A62] rounded-lg overflow-hidden bg-transparent"
        style={{ width: containerWidth, height: containerHeight }}
      />
    </div>
  );
};

export default PhysicsSkills;