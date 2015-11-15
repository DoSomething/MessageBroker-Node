suite('Global Tests', function() {
  test('page has a valid title', function() {
    assert(document.title && document.title.match(/\S/) &&
      document.title.toUpperCase() !== 'TODO');
  });
  test('page has DS logo in header', function() {
    assert($('header img#logo').attr("src") === '/img/dosomething-logo.png');
  });
});