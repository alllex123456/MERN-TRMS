export const getReadableUnit = (userUnits, subjectUnit) => {
  const readableUnitIndex = userUnits.findIndex(
    (unit) => unit.value === subjectUnit
  );
  const readableUnit = userUnits[readableUnitIndex]?.displayedValue;

  return readableUnit;
};
