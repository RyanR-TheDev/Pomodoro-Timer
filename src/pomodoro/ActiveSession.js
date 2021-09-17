import React from "react";
import ProgressBar from "./ProgressBar";
import { secondsToDuration, minutesToDuration } from "../utils/duration";

const ActiveSession = ({totalDuration, progress, session}) => {
  return session && (
    <>
      <div className="row mb-2">
        <div className="col">
          <h2 data-testid="session-title">
            {session?.label} for {minutesToDuration(totalDuration)} minutes
          </h2>
          <p className="lead" data-testid="session-sub-title">
            {secondsToDuration(session?.timeRemaining)} remaining
          </p>
        </div>
      </div>
      <ProgressBar session={session} progress={progress} />
    </>
  );
}

export default ActiveSession;