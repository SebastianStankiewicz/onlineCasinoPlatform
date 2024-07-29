import React, { useEffect, useRef, useState } from "react";
import Matter, { World } from "matter-js";

const PlinkoGameBoard = ({ dropLocation, setDropLocation, betOutcome }) => {
  const scene = useRef();
  const engine = useRef(Matter.Engine.create());
  const [boxes, setBoxes] = useState([]);
  const rows = 16;
  const cols = 12;
  const WIDTH = 800;
  const HEIGHT = 800;

  const [plinkos, setPlinkos] = useState([]);
  const numBuckets = 17;

  const multipliers = [
    16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16,
  ];

  const [recentOutcomes, setRecentOutcomes] = useState([]);

  const [dataPointMapping, setDataPointMapping] = useState({
    0.5: [],
    1: [],
    1.1: [],
    1.2: [],
    1.4: [],
    2: [],
    9: [],
    16: [],
  });

  useEffect(() => {
    const renderScene = scene.current;
    const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;

    // create an engine
    const world = engine.current.world;

    // create a renderer
    const render = Render.create({
      element: renderScene,
      engine: engine.current,
      options: {
        width: WIDTH,
        height: HEIGHT,
        wireframes: false,
        background: "#272a36",
      },
    });

    //Create the pegs
    for (var row = 2; row < rows; row++) {
      var numPegs = row + 1;
      const y = 0 + row * 35;
      const spacing = 45;

      for (let col = 0; col < numPegs; col++) {
        const x = WIDTH / 2 - spacing * (row / 2 - col);
        createPlinko(x, y, 5);
      }
    }

    // Create the buckets
    const SPACING = 4 * 4;
    const sinkWidth = 42;

    for (let i = 0; i < numBuckets; i++) {
      const x =
        WIDTH / 2 +
        sinkWidth * (i - Math.floor(numBuckets / 2)) -
        SPACING * 1.5;
      const y = HEIGHT - 170;
      createBucket(x + 30, y, 35, 35, 4, multipliers[i]);
    }

    // run the engine
    Matter.Runner.run(engine);

    // run the renderer
    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine.current);

    // Add the afterRender event to draw text
    Events.on(render, "afterRender", () => {
      const context = render.context;
      const bodies = Composite.allBodies(engine.current.world);

      bodies.forEach((body) => {
        const { text, textColor, textFont, ball } = body.render;
        if (ball) {
          //If inline with buckets now run the check for all objects
          if (body.position.y >= 605) {
            //re iterate through all objects and see if colliuson made
            bodies.forEach((body2) => {
              //Check its a square (only they have text)
              //Body2 refers to the other object colliding with ball
              const text = body.render;
              if (text) {
                if (Matter.Collision.collides(body, body2) != null) {
                  if (body2.render.text) {
                    appendToRecentOutcomes(
                      body2.render.text,
                      body.render.betOutcome
                    );
                    appendToDataMapping(
                      body2.render.text,
                      body.render.startLocation
                    );
                  }
                  World.remove(world, body);
                }
              }
            });
          }
        }

        if (text) {
          context.fillStyle = textColor;
          context.font = textFont;
          const textWidth = context.measureText(text).width;
          context.fillText(
            text,
            body.position.x - textWidth / 2,
            body.position.y + 6
          );
        }
      });
    });

    // cleanup function
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world, false);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  useEffect(() => {
    if (dropLocation !== null) {
      addPreDeterminedBall(dropLocation, betOutcome);
      setDropLocation(null);
    }
  }, [dropLocation]);

  //Used for testing
  const addRandomBall = () => {
    const { Bodies, Composite } = Matter;
    const startLocation = Math.random() * (500 - 300) + 300;
    const newBall = Bodies.circle(startLocation, 0, 7, {
      restitution: 0.5,
      render: {
        fillStyle: "#00FF00",
        ball: "true",
        startLocation: startLocation,
      },
      collisionFilter: { group: -1, category: 0x0001, mask: 0xffff },
    });
    Composite.add(engine.current.world, newBall);
    setBoxes((prevBoxes) => [...prevBoxes, newBall]);
  };

  const addPreDeterminedBall = (startLocation, betOutcome) => {
    const { Bodies, Composite } = Matter;
    const newBall = Bodies.circle(startLocation, 0, 7, {
      restitution: 0.5,
      render: {
        fillStyle: "#00FF00",
        ball: "true",
        startLocation: startLocation,
        betOutcome: betOutcome,
      },
      collisionFilter: { group: -1, category: 0x0001, mask: 0xffff },
    });
    Composite.add(engine.current.world, newBall);
    setBoxes((prevBoxes) => [...prevBoxes, newBall]);
  };

  //Used to show the 5 most recent games
  const appendToDataMapping = (key, value) => {
    setDataPointMapping((prevState) => {
      // Create a copy of the current state
      const newState = { ...prevState };

      // Append the new value to the list for the specified key
      newState[key] = [...newState[key], value];

      return newState;
    });
  };

  const appendToRecentOutcomes = (multiplier, betOutcome) => {
    // Create the new entry
    const newEntry = `${multiplier}x: $${betOutcome}`;

    // Update state with new entry, keeping only the 5 most recent
    setRecentOutcomes((prevOutcomes) => {
      // Add the new entry to the beginning of the list
      const updatedOutcomes = [newEntry, ...prevOutcomes];

      // Return only the first 5 most recent entries
      return updatedOutcomes.slice(0, 5);
    });
  };

  const runSimulation = () => {
    let count = 0;
    const intervalId = setInterval(() => {
      if (count >= 100) {
        clearInterval(intervalId);
      } else {
        addRandomBall();
        count++;
      }
    }, 1000);
  };

  const createPlinko = (x, y, r) => {
    const { Bodies, Composite } = Matter;
    const options = {
      restitution: 1,
      friction: 0,
      isStatic: true,
      render: { fillStyle: "#ff7cc4" },
    };
    const newPlinko = Bodies.circle(x, y, r, options);
    Composite.add(engine.current.world, newPlinko);
    setPlinkos((prevPlinkos) => [...prevPlinkos, newPlinko]);
  };

  const createBucket = (x, y, width, height, cornerRadius, multiplier) => {
    const { Bodies, Composite } = Matter;
    const options = {
      chamfer: { radius: cornerRadius },
      restitution: 0.5,
      friction: 0.1,
      isStatic: true,
      render: {
        fillStyle: "#00aaff",
        text: multiplier,
        textColor: "#ffffff",
        textFont: "19px Ariel",
      },
    };
    const newBucket = Bodies.rectangle(x, y, width, height, options);
    Composite.add(engine.current.world, newBucket);

    return newBucket;
  };

  return (
    <div>
      <div ref={scene} />
      
      <ul className="flex space-x-2">
        {recentOutcomes.map((outcome, index) => (
          <li key={index} className="bg-primary p-2 rounded-lg text-center">
            {outcome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlinkoGameBoard;
