import React from 'react';

const ProgressBar = ({session, progress}) => {
  return session && (
    <div className="row mb-2">
      <div className="col">
        <div className="progress" style={{ height: "20px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;