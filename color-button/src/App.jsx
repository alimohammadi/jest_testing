import "./App.css";
import { useState } from "react";
// import { kebabCaseToTitleCase } from "./helpers";

function App() {
  const [disabled, setDisabled] = useState(false);
  const [buttonColor, setButtonColor] = useState("red");
  const nextColorClass = buttonColor === "red" ? "blue" : "red";

  // const nextColorTitleCase = kebabCaseToTitleCase(nextColorClass);
  // const className = disabled ? "gray" : buttonColor;

  return (
    <div>
      <button
        onClick={() => setButtonColor(nextColorClass)}
        // className={className}
        style={{ backgroundColor: buttonColor }}
        disabled={disabled}
      >
        Change to {nextColorClass}
      </button>

      <input
        type="checkbox"
        checked={disabled}
        onClick={() => setDisabled(!disabled)}
      />
    </div>
  );
}

export default App;
