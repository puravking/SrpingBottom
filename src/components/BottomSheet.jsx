import { useEffect, useState } from "react";
import "./BottomSheet.css";

import PHOTO_URL from "../image.png"; // adjust path as needed

const GITHUB_URL = "https://github.com/puravking";
const LINKEDIN_URL = "https://www.linkedin.com/in/purav-5641b7254/";
const LEETCODE_URL = "https://leetcode.com/yourleetcodeusername/";

const BottomSheet = () => {
  const [classChange, setClassChange] = useState(false);
  const [height, setHeight] = useState(10);
  const [positionMove, setPositionMove] = useState(undefined);

  const positionMoveStart = (event) => {
    let y = atPosition(event).pageY;
    setPositionMove(y);
    setClassChange(true);
    document.body.style.cursor = "grabbing";
  };

  const positionMoveEnd = () => {
    setPositionMove(undefined);
    setClassChange(false);
    document.body.style.cursor = "";
    if (height < 25) {
      setHeight(10);
    } else if (height > 75) {
      setHeight(100);
    } else {
      setHeight(50);
    }
  };

  const positionMoving = (event) => {
    if (positionMove === undefined) return;
    const y = atPosition(event).pageY;
    const deltaY = positionMove - y;
    setPositionMove(y);
    const deltaHeight = (deltaY / window.innerHeight) * 100;
    setHeight((prev) => Math.min(100, Math.max(10, prev + deltaHeight)));
  };

  function atPosition(e) {
    return e.touches ? e.touches[0] : e;
  }

  const handleEscape = (event) => {
    if (event.key === "Escape" && height !== 10) {
      setHeight(10);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleEscape);
    window.addEventListener("mousemove", positionMoving);
    window.addEventListener("touchmove", positionMoving);
    window.addEventListener("mouseup", positionMoveEnd);
    window.addEventListener("touchend", positionMoveEnd);

    return () => {
      window.removeEventListener("keyup", handleEscape);
      window.removeEventListener("mousemove", positionMoving);
      window.removeEventListener("touchmove", positionMoving);
      window.removeEventListener("mouseup", positionMoveEnd);
      window.removeEventListener("touchend", positionMoveEnd);
    };
  }, [classChange, positionMove]);

  const isFullyOpen = height === 100;

  const renderContent = () => {
    if (height === 10) {
      return <p className="displayMessage">Drag me up to see my profiles!</p>;
    } else if (height === 50) {
      return (
        <div className="profileLinks">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="profileLink">
            GitHub
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="profileLink">
            LinkedIn
          </a>
        </div>
      );
    } else if (height === 100) {
      return (
        <div className="profileLinks">
          <a href={LEETCODE_URL} target="_blank" rel="noreferrer" className="profileLink">
            LeetCode
          </a>
          <p>Full-Stack Developer</p>
        </div>
      );
    } else {
      return <p className="displayMessage">Drag up/down to explore profiles!</p>;
    }
  };

  return (
    <div className="mainContainer">
      {/* Photo and greeting */}
      <div className={`flex photoContainer ${isFullyOpen ? "blurred" : ""}`}>
        <img src={PHOTO_URL} alt="Purav" className="profilePhoto" />
        <h2>Hello there</h2>
      </div>

      {/* Bottom sheet */}
      <div className="childContainer" role="dialog">
        <div className="homePage" onClick={() => setHeight(10)}></div>
        <div
          style={{ height: `${height}vh` }}
          className={
            height === 100
              ? classChange
                ? "contents fullscreen notSelectable"
                : "contents fullscreen"
              : classChange
              ? "contents notSelectable"
              : "contents"
          }
        >
          <header className="controls">
            <div
              className="dragArea"
              onMouseDown={positionMoveStart}
              onTouchStart={positionMoveStart}
              style={{ cursor: classChange ? "grabbing" : "grab" }}
            >
              <div className="dragThumb"></div>
            </div>
            {height > 25 && (
              <button
                className="closeContainer"
                title="Close"
                onClick={() => setHeight(10)}
              >
                X
              </button>
            )}
          </header>

          <div className="body">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
