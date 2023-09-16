/* eslint-disable @typescript-eslint/no-non-null-assertion */

/* eslint-disable @typescript-eslint/no-unused-vars */

///Todo: publish to npm

///Draggable Elements By Roee Heily!

///This Code is some side project of mine so feel free to mess around and upgrade or change it to your liking

import React, { useEffect, useRef, useState } from "react";

import "./styles.css";

//defining the props type with all the options and customizations

export type DraggablePropsType = {
  //sets the position to be "absolute" or 'fixed"

  position?: "absolute" | "fixed";

  //sets the custom drag animation

  animation?: "scaleUp" | "scaleDown" | "opacityBlur" | null;

  //sets the timer for the long press to invoke the dragging logic (in seconds)

  pressTime?: number;

  //sets a boolean to check whether or not to change the cursor style while dragging

  customCursor?: boolean;

  //react's children components

  children?: React.ReactElement | never[];

  //event handler for short press on the component

  onClick?: React.MouseEventHandler;

  //event handler for the start of the drag

  onDragStart?: React.DragEventHandler;

  //event handler for while dragging

  onDrag?: React.DragEventHandler;

  //event handler for the end of the dragging

  onDragEnd?: React.DragEventHandler;
};

//Draggable Component Function

function Draggable(Props: DraggablePropsType) {
  //defines a timerRef for the pressTimer that set itself as null at start to prevent a bug by accidently being a number at the beginning of the render

  const timerRef = useRef<number | null>(null);

  //defines a refrence for the component that is default value is null in order to be a placeholder

  const ref = useRef<HTMLDivElement>(null);

  //defines a state to check whether or not the child of the Draggable Component is a container for multiple other child elements so it can manage them without harming their form and state.

  const [isComplexChild, setIsComplexChild] = useState<boolean>(true);

  const { pressTime, customCursor, ...props } = Props;

  //defines a function that handles onMouseDown event

  function handleMouseDown(e: MouseEvent) {
    //setting the current timer refrence to a setTimeout method that invokes a function according to the pressTime prop produced by the user. if no pressTime was produced, the default is 1 second (1000 mileseconds).

    timerRef.current = window.setTimeout(() => {
      //defines the event target (the element we are currently pressing) in order to set it's position method ("fixed" | "absolute")

      const eventTarget = (e.target as HTMLElement).closest("#Draggable")
        ?.firstChild as HTMLElement;

      if (customCursor) eventTarget.style.cursor = "grab";

      if (props.position && !eventTarget.firstChild) {
        setIsComplexChild(false);

        eventTarget.style.position = props.position || "absolute";
      }

      if (props.animation) {
        const animationKeyFrames = getAnimationKeyFrames(props.animation)!;

        eventTarget.style.animation = `.3s ${animationKeyFrames[0]} ease forwards`;
      }

      //adding an event to the component listener to detect any mouse movement after this function is finally invoked

      ref.current?.addEventListener("mousemove", handleMouseMove);
    }, (pressTime! * 1000) | 1000);

    e.preventDefault();
  }

  //defines a function that handles the onMouseMove event handler after the onMouseDown event is handled

  function handleMouseMove(e: MouseEvent) {
    //calculating the eventTarget (currentComponent) center in order to use it to adjust the cursor to the center of the element while dragging

    const eventTarget = (e.target as HTMLElement).closest("#Draggable")
      ?.firstChild as HTMLElement;

    const { left, top } = calcElementCenterOffsetMouse(e);

    //rerendering the styles of the component to much the new position of the cursor using the boundingRect properties and the offset we previosly calculated

    requestAnimationFrame(() => {
      eventTarget.style.left = `${left}px`;

      eventTarget.style.top = `${top}px`;
    });

    //calculating the distance the cursor passes using the current movement of the cursor and the sentence of pitagoras (x**2+y**2=z**2 while z acts like a distance)

    //calculating the current time using 1 timestamp and substracting it with the time elapsed (timeRef.current)

    //calculating the current speed of the cursor using the speed*time=distance (goes the other way around: distance/time=speed)

    e.preventDefault();
  }

  //defines a function that handles the onMouseUp event handler

  function handleMouseUp(e: MouseEvent) {
    //if there is still a timerRef.current clear it and define it as null in order to stop the timer.

    if (timerRef.current) {
      clearTimeout(timerRef.current);

      timerRef.current = null;

      const eventTarget = (e.target as HTMLElement).closest("#Draggable")
        ?.firstChild as HTMLElement;

      if (customCursor) eventTarget.style.cursor = "auto";

      if (props.animation) {
        const animationKeyFrames = getAnimationKeyFrames(props.animation)!;

        eventTarget.style.animation = `.3s ${animationKeyFrames[1]} ease forwards`;
      }

      //after stopping the timer, there is a need to remove the mousemove event listener in order to prevent overAdding event listeners

      ref.current?.removeEventListener("mousemove", handleMouseMove);

      e.preventDefault();
    }
  }

  //defines a function that handles the onMouseLeave event handler

  function handleMouseLeave(e: MouseEvent) {
    //if there is still a timerRef.current clear it and define it as null in order to stop the timer.

    if (timerRef.current) {
      clearTimeout(timerRef.current);

      timerRef.current = null;

      console.log("Mouse Went Away!");

      const eventTarget = (e.target as HTMLElement).closest("#Draggable")
        ?.firstChild as HTMLElement;

      console.log(eventTarget);

      if (customCursor) eventTarget.style.cursor = "auto";

      if (props.animation) {
        const animationKeyFrames = getAnimationKeyFrames(props.animation)!;

        eventTarget.style.animation = `.3s ${animationKeyFrames[1]} ease forwards`;
      }

      //after stopping the timer, there is a need to remove the mousemove event listener in order to prevent overAdding event listeners

      ref.current?.removeEventListener("mousemove", handleMouseMove);
    }

    e.preventDefault();
  }

  //Touch Support

  function handleTouchStart(e: TouchEvent) {
    timerRef.current = window.setTimeout(() => {
      //defines the event target (the element we are currently pressing) in order to set it's position method ("fixed" | "absolute")

      const eventTarget = (e.target as HTMLElement).closest("#Draggable")
        ?.firstChild as HTMLElement;

      if (props.position && !eventTarget.firstChild) {
        setIsComplexChild(false);

        eventTarget.style.position = props.position || "absolute";
      }

      eventTarget.ondragstart = (e: MouseEvent) => {
        onselectstart = (_e) => false;

        e.preventDefault();

        e.stopPropagation();
      };

      if (props.animation) {
        const animationKeyFrames = getAnimationKeyFrames(props.animation)!;

        eventTarget.style.animation = `.3s ${animationKeyFrames[0]} ease forwards`;
      }

      //adding an event to the component listener to detect any mouse movement after this function is finally invoked

      ref.current?.addEventListener("touchmove", handleTouchMove);
    }, (pressTime! * 1000) | 1000);

    e.preventDefault();
  }

  function handleTouchMove(e: TouchEvent) {
    console.log("Touch Move");

    //calculating the eventTarget (currentComponent) center in order to use it to adjust the cursor to the center of the element while dragging

    const eventTarget = (e.target as HTMLElement).closest("#Draggable")
      ?.firstChild as HTMLElement;

    const { left, top } = calcElementCenterOffsetTouch(e);

    requestAnimationFrame(() => {
      eventTarget.style.left = `${left}px`;

      eventTarget.style.top = `${top}px`;
    });

    e.preventDefault();
  }

  function handleTouchEnd(e: TouchEvent) {
    console.log("Touch End");

    //if there is still a timerRef.current clear it and define it as null in order to stop the timer.

    if (timerRef.current) {
      clearTimeout(timerRef.current);

      timerRef.current = null;

      const eventTarget = (e.target as HTMLElement).closest("#Draggable")
        ?.firstChild as HTMLElement;

      console.log(eventTarget);

      if (props.animation) {
        const animationKeyFrames = getAnimationKeyFrames(props.animation)!;

        eventTarget.style.animation = `.3s ${animationKeyFrames[1]} ease forwards`;
      }

      //after stopping the timer, there is a need to remove the mousemove event listener in order to prevent overAdding event listeners

      ref.current?.removeEventListener("touchmove", handleTouchMove);
    }

    e.preventDefault();
  }

  function handleTouchCancel(_e: TouchEvent) {
    console.log("Touch Cancel");
  }

  function calcElementCenterOffsetMouse(e: MouseEvent) {
    const mouseX = e.clientX;

    const mouseY = e.clientY;

    const boundingRect = (e.target as HTMLElement).getBoundingClientRect();

    const elementCenterX = boundingRect.left + boundingRect.width / 2;

    const elementCenterY = boundingRect.top + boundingRect.height / 2;

    const offsetX = mouseX - elementCenterX;

    const offsetY = mouseY - elementCenterY;

    return {
      left: boundingRect.left + offsetX,

      top: boundingRect.top + offsetY,
    };
  }

  function calcElementCenterOffsetTouch(e: TouchEvent) {
    const touchX = e.touches[0].clientX;

    const touchY = e.touches[0].clientY;

    const boundingRect = (e.target as HTMLElement).getBoundingClientRect();

    const elementCenterX = boundingRect.left + boundingRect.width / 2;

    const elementCenterY = boundingRect.top + boundingRect.height / 2;

    const offsetX = touchX - elementCenterX;

    const offsetY = touchY - elementCenterY;

    return {
      left: boundingRect.left + offsetX,

      top: boundingRect.top + offsetY,
    };
  }

  //defines a functions that checks what is the animation name using a switch statement and returns the diffrent keyframes names withn the chosen animations in an array of strings

  function getAnimationKeyFrames(animationName: string) {
    switch (animationName) {
      case "scaleUp":
        return ["scale-up", "scale-up-to-normal"];

      case "scaleDown":
        return ["scale-down", "scale-down-to-noraml"];

      case "opacityBlur": {
        return ["opacity-out", "opacity-in"];
      }

      default:
        return [];
    }
  }

  //the useEffect Hook is being used to add event listeners on component Mount and using the clean up return () => ... method to clean up those event listeners on component unMount

  useEffect(() => {
    //checking if three is a current component refrence

    const currentComponentRef: HTMLElement | null = ref.current;

    //if there is a current component refrence, the code below adds all of the neccassry eventListeners in order for the component to mount properly with those eventListeners

    if (currentComponentRef) {
      //Mouse Event Listeners

      currentComponentRef.addEventListener("mousedown", handleMouseDown);

      currentComponentRef.addEventListener("mouseup", handleMouseUp);

      currentComponentRef.addEventListener("mouseleave", handleMouseLeave);

      //Touch Events Listeners

      currentComponentRef.addEventListener("touchstart", handleTouchStart);

      currentComponentRef.addEventListener("touchmove", handleTouchMove);

      currentComponentRef.addEventListener("touchend", handleTouchEnd);

      currentComponentRef.addEventListener("touchcancel", handleTouchCancel);

      //on component unMount clean up all of the eventListeners and clear the pressTimer

      return () => {
        currentComponentRef.removeEventListener("mousedown", handleMouseDown);

        currentComponentRef.removeEventListener("mouseup", handleMouseUp);

        currentComponentRef.removeEventListener("mousemove", handleMouseMove);

        currentComponentRef.removeEventListener("mouseleave", handleMouseLeave);

        currentComponentRef.removeEventListener("touchstart", handleTouchStart);

        currentComponentRef.removeEventListener("touchmove", handleTouchMove);

        currentComponentRef.removeEventListener("touchend", handleTouchEnd);

        currentComponentRef.removeEventListener(
          "touchcancel",

          handleTouchCancel
        );

        if (timerRef.current) {
          clearTimeout(timerRef.current);

          timerRef.current = null;
        }
      };

      //if there is no component, therefore it doesn't exists
    } else {
      console.error("Component Is Not Existing!");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //defines the component ref and it's props using object destructing

  return (
    <div
      onDragStart={() => setTimeout(() => props.onDragStart, pressTime || 1000)}
      onDrag={() => props.onDrag}
      onDragEnd={() => props.onDragEnd}
      style={{
        position:
          props.position && isComplexChild ? props.position : "absolute",
      }}
      id="Draggable"
      ref={ref}
      {...props}
    />
  );
}

//exporting the Draggable component as a default export

export default Draggable;
