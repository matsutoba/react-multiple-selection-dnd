import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { DraggableBox } from "./DraggableComponent";
import { useDrag, useDrop } from "react-dnd";
import Selecto from "react-selecto";
import { getEmptyImage } from "react-dnd-html5-backend";
import { CustomDragLayer } from "./CustomDragLayer";

const DraggableArea = styled.div`
  width: 120px;
  height: 120px;
  border: 1px solid #000;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const DroppableArea = styled.div`
  width: 300px;
  height: 300px;
  border: 1px solid #f00;
`;

function App() {
  // Boxes for selecting with drag
  const [boxes, setBoxes] = useState([
    { id: "1", selected: false },
    { id: "2", selected: false },
    { id: "3", selected: false },
    { id: "4", selected: false },
    { id: "5", selected: false },
  ]);

  // this will be true when multiple box are selecting
  const [isMultiSelectEnd, setIsMultiSelectEnd] = useState(false);

  const resetSelection = useCallback(() => {
    setBoxes(boxes.map((box) => ({ id: box.id, selected: false })));
    setIsMultiSelectEnd(false);
  }, [boxes]);

  // Drag handler
  const [{ canDrag, isDragging }, drag, preview] = useDrag(
    () => ({
      type: "boxes",
      item: boxes.filter((box) => box.selected) || [],
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        canDrag: isMultiSelectEnd,
        didDrop: monitor.didDrop(),
      }),
      end: (item, monitor) => {
        // Unselect all whenever dropping end
        resetSelection();
      },
    }),
    [isMultiSelectEnd]
  );

  // Drop handler
  const [, drop] = useDrop<string[], void, any>(() => ({
    accept: "boxes",
    drop: (item, monitor) => {
      console.log("Drop end");
      item.forEach((box) => {
        console.log("drop", item, monitor.getClientOffset());
      });
    },
  }));

  useEffect(() => {
    preview(getEmptyImage());
  }, [preview]);

  return (
    <>
      {isDragging && <CustomDragLayer />}
      <DraggableArea
        className="dragArea"
        ref={isMultiSelectEnd ? drag : null}
        onClick={resetSelection}
      >
        {boxes.map((box) => {
          return (
            <DraggableBox
              key={box.id}
              id={box.id}
              selected={box.selected}
              isMultiSelecting={isMultiSelectEnd}
            />
          );
        })}
      </DraggableArea>
      <DroppableArea ref={drop} />
      {/* Selecto */}
      <Selecto
        preventDefault={true}
        hitRate={50}
        selectFromInside={false}
        selectByClick={false}
        dragContainer={isMultiSelectEnd ? "" : ".dragArea"}
        selectableTargets={isMultiSelectEnd ? [] : [".box"]}
        onDragStart={(e) => {
          if (canDrag) {
            e.stop();
          }
        }}
        onSelect={(e) => {
          const addedIds = e.added.map((e) => e.id);
          const removedIds = e.added.map((e) => e.id);
          const newBoxes = boxes.map((box) => {
            if (addedIds.includes(box.id)) {
              return {
                id: box.id,
                selected: true,
              };
            }
            if (removedIds.includes(box.id)) {
              return {
                id: box.id,
                selected: false,
              };
            }
            return box;
          });
          setBoxes(newBoxes);
        }}
        onSelectEnd={(e) => {
          if (e.selected.length > 0) {
            setIsMultiSelectEnd(true);
          }
        }}
      />
      <p>isSelectEnd: {isMultiSelectEnd ? "true" : "false"}</p>
      <p>canDrag: {canDrag ? "true" : "false"}</p>
    </>
  );
}

export default App;
