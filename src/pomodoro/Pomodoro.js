import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import FocusDuration from "./FocusDuration";
import BreakDuration from "./BreakDuration";
import MediaControls from "./MediaControls";
import ActiveSession from "./ActiveSession";

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);

  return {
    ...prevState,
    timeRemaining
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const onIncreaseFocus = () => {
    if (focusDuration === 60) return;
    setFocusDuration(focusDuration + 5);
  };

  const onDecreaseFocus = () => {
    if (focusDuration === 5) return;
    setFocusDuration(focusDuration - 5);
  };

  const onIncreaseBreak = () => {
    if (breakDuration === 15) return;
    setBreakDuration(breakDuration + 1);
  };

  const onDecreaseBreak = () => {
    if (breakDuration === 1) return;
    setBreakDuration(breakDuration - 1);
  };

  const onStop = () => {
    setIsTimerRunning(false);
    setSession(null);
  }

  const totalDuration = session?.label === "Focusing" ? focusDuration : breakDuration;
  const durationInSecs = totalDuration * 60;
  const progress = ((durationInSecs - session?.timeRemaining) / durationInSecs) * 100;
 
  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;

      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60
            };
          }
          return prevStateSession;
        });
      }

      return nextState;
    });
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <FocusDuration 
          session={session}
          focusDuration={focusDuration}
          onIncreaseFocus={onIncreaseFocus}
          onDecreaseFocus={onDecreaseFocus}
        />
        <BreakDuration 
          session={session}
          breakDuration={breakDuration}
          onIncreaseBreak={onIncreaseBreak}
          onDecreaseBreak={onDecreaseBreak}
        />
      </div>
      <div className="row">
        <MediaControls
          session={session}
          playPause={playPause} 
          onStop={onStop}
          classNames={classNames} 
          isTimerRunning={isTimerRunning} 
        />
      </div>
      <div>
        <ActiveSession 
          session={session} 
          progress={progress}
          totalDuration={totalDuration}
        />
      </div>
    </div>
  );
}

export default Pomodoro;