import { useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts";

function App() {
  const ATTRIBUTE_STATE = {};
  const ATTRIBUTE_MODIFITER_STATE = {};
  const SKILL_POINTS = {};

  ATTRIBUTE_LIST.forEach((item, index) => {
    ATTRIBUTE_STATE[item] = 10;
    ATTRIBUTE_MODIFITER_STATE[item] = 0;
  });

  SKILL_LIST.forEach((item, index) => {
    SKILL_POINTS[item["name"]] = 0;
  });
  SKILL_POINTS["totalPoints"] = 0;

  const [attributes, setAttributes] = useState(ATTRIBUTE_STATE);
  const [attributeModifiers, setAttributeModifiers] = useState(
    ATTRIBUTE_MODIFITER_STATE
  );

  const [skillPoints, setSkillPoints] = useState(SKILL_POINTS);

  // Class details visibility state
  const [visibleClass, setVisibleClass] = useState(null);

  // Ability Modifier
  const calculateAbilityModifier = (attribute: string, value: number): void => {
    setAttributeModifiers((attributeModifiers) => ({
      ...attributeModifiers,
      [attribute]: Math.floor((value - 10) / 2),
    }));
  };

  const incrementAttribute = (attribute: string) => {
    const value = attributes[attribute] + 1;
    setAttributes((attributes) => ({
      ...attributes,
      [attribute]: value,
    }));

    calculateAbilityModifier(attribute, value);
  };

  const decrementAttribute = (attribute: string) => {
    const value = Math.max(attributes[attribute] - 1, 0); // don't allow negative
    setAttributes((attributes) => ({
      ...attributes,
      [attribute]: value,
    }));

    calculateAbilityModifier(attribute, value);
  };

  // Toggle visibility class click
  const toggleClassVisibility = (id: string) => {
    if (visibleClass === id) {
      setVisibleClass(null);
    } else {
      setVisibleClass(id);
    }
  };

  // Check for class requirement
  const meetsRequirements = (className: string): boolean => {
    return ATTRIBUTE_LIST.every((attribute) => {
      return attributes[attribute] >= CLASS_LIST[className][attribute];
    });
  };

  const addSkill = (skill: string) => {
    if (skillPoints["totalPoints"] + 1 > totalAvailablePoints()) {
      return;
    }
    setSkillPoints((skillPoints) => ({
      ...skillPoints,
      [skill]: skillPoints[skill] + 1,
      ["totalPoints"]: skillPoints["totalPoints"] + 1,
    }));
  };

  const removeSkill = (skill: string) => {
    setSkillPoints((skillPoints) => ({
      ...skillPoints,
      [skill]: Math.max(skillPoints[skill] - 1, 0),
      ["totalPoints"]: Math.max(skillPoints["totalPoints"] - 1, 0),
    }));
  };

  const totalAvailablePoints = (): number => {
    return 10 + 4 * attributeModifiers["Intelligence"];
  };

  return (
    <>
      <div>
        <h1>RPG</h1>

        {/* Attributes */}
        <div>
          <h2>Attributes</h2>
          <table>
            <tbody>
              {ATTRIBUTE_LIST.map((attribute) => (
                <tr key={attribute}>
                  <td>
                    {attribute}: {attributes[attribute]}
                  </td>

                  <td>
                    <button onClick={() => decrementAttribute(attribute)}>
                      -
                    </button>
                  </td>
                  <td>
                    <button onClick={() => incrementAttribute(attribute)}>
                      +
                    </button>
                  </td>
                  <td> Modifier: {attributeModifiers[attribute]} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Classes */}
        <div>
          <h2>Classes</h2>
          {Object.entries(CLASS_LIST).map(([className, attributes]) => {
            const classKey = className;
            const classMeets = meetsRequirements(className);
            return (
              <ul>
                <li
                  key={classKey}
                  style={{
                    cursor: "pointer",
                    fontWeight: classMeets ? "bold" : "normal",
                    color: classMeets ? "green" : "black",
                  }}
                  onClick={() => toggleClassVisibility(classKey)}
                >
                  {classKey}
                </li>

                {visibleClass === classKey && (
                  <div style={{ marginLeft: "10px", marginTop: "5px" }}>
                    {Object.entries(attributes).map(([attribute, value]) => (
                      <li key={attribute}>
                        {attribute}: {value}
                      </li>
                    ))}
                  </div>
                )}
              </ul>
            );
          })}
        </div>

        {/* Skills */}
        <div>
          <h2>Skills</h2>
          <p>
            {" "}
            Total Available Points : {totalAvailablePoints()}{" "}
            {skillPoints["totalPoints"] + 1 > totalAvailablePoints() &&
              "All points used up!"}
          </p>
          <ul>
            {SKILL_LIST.map((skill, index) => (
              <li key={index}>
                <strong>{skill.name}</strong> - points:{" "}
                {skillPoints[skill.name]} {skill.attributeModifier}:{" "}
                {attributeModifiers[skill.attributeModifier]}
                <button onClick={() => removeSkill(skill.name)}>-</button>
                <button onClick={() => addSkill(skill.name)}>+</button>
                total:{" "}
                {skillPoints[skill.name] > 0
                  ? skillPoints[skill.name] +
                    attributeModifiers[skill.attributeModifier]
                  : 0}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
