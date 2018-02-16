export var fakeSuggestItems = ['Apple', 'Orange', 'Mango', 'Blackberry', 'Pineapple', 'Strawberry'];
var fakeSearchItems = [
  'An apple is a sweet, edible fruit produced by an apple tree (Malus pumila). Apple trees are cultivated worldwide as a fruit tree, and is the most widely grown species in the genus Malus.',
  'The orange is the fruit of the citrus species Citrus × sinensis in the family Rutaceae.[1] It is also called sweet orange, to distinguish it from the related Citrus × aurantium, referred to as bitter orange.',
  'Mangoes are juicy stone fruit (drupe) from numerous species of tropical trees belonging to the flowering plant genus Mangifera, cultivated mostly for their edible fruit.',
  'The blackberry is an edible fruit produced by many species in the genus Rubus in the family Rosaceae, hybrids among these species within the subgenus Rubus, and hybrids between the subgenera Rubus and Idaeobatus.',
  'The pineapple (Ananas comosus) is a tropical plant with an edible multiple fruit consisting of coalesced berries, also called pineapples,[2][3] and the most economically significant plant in the Bromeliaceae family.',
  'The garden strawberry (or simply strawberry; Fragaria × ananassa)[1] is a widely grown hybrid species of the genus Fragaria, collectively known as the strawberries. It is cultivated worldwide for its fruit.'
];

var getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export var getSuggestItems = (query) => {
  query = query.toLowerCase();
  var result = fakeSuggestItems.filter((item) => item.toLowerCase().includes(query));

  // random delay between 100 and 1000 ms
  return new Promise((resolve) => {
    var delay = getRandomInt(100, 1000);

    setTimeout(() => {
      resolve(result);
    }, delay);
  });
};

export var getSearchItems = (query) => {
  query = query.toLowerCase();
  var result = fakeSearchItems.filter((item) => item.toLowerCase().includes(query));

  // random delay between 500 and 2000 ms
  return new Promise((resolve) => {
    var delay = getRandomInt(500, 2000);

    setTimeout(() => {
      resolve(result);
    }, delay);
  });
};
