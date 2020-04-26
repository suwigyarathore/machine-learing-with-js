const outputs = [];
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  // Write code here to analyze stuff
  const testSetSize = 100;
  const k = 10;
  _.range(0, 3).forEach((feature) => {
    // feature === 0, feature === 1, feature === 2
    const data = _.map(outputs, (row) => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testSet)
      .filter(
        (testPoint) =>
          knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log("Accuracy for feature", feature, " is ", accuracy);
  });
}

function knn(data, point, k) {
  // point has 3 value
  return _.chain(data)
    .map((row) => [distance(_.initial(row), point), _.last(row)])
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}

function minMax(data, featureCount) {
  const cloneData = _.cloneDeep(data);
  for (let i = 0; i < featureCount; i++) {
    const col = cloneData.map((row) => row[i]);
    const min = _.min(col);
    const max = _.max(col);

    for (let j = 0; j < cloneData.length; j++) {
      cloneData[j][i] = (cloneData[j][i] - min) / (max - min);
    }
  }

  return cloneData;
}
