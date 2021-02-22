const CustomUrl = require('../src/CustomUrl');

test('It detects a valid url', () => {
    const testUrl = new CustomUrl('http://example.com');

    expect(testUrl.isAbsoluteUrl('http://example.com')).toBeTruthy();
    expect(testUrl.isAbsoluteUrl('http://example.de')).toBeTruthy();
    expect(testUrl.isAbsoluteUrl('http://example-with-dashes.and.subdomains.de')).toBeTruthy();
    expect(testUrl.isAbsoluteUrl('https://example.com')).toBeTruthy();

    expect(testUrl.isAbsoluteUrl('https:/example.com')).toBeFalsy();
    expect(testUrl.isAbsoluteUrl('://example.com')).toBeFalsy();
    expect(testUrl.isAbsoluteUrl('http://example.')).toBeFalsy();
    expect(testUrl.isAbsoluteUrl('http://examplecom')).toBeFalsy();
    expect(testUrl.isAbsoluteUrl('ftp://example.com')).toBeFalsy();
    expect(testUrl.isAbsoluteUrl('#example')).toBeFalsy();
    expect(testUrl.isAbsoluteUrl('example/example1')).toBeFalsy();
    expect(testUrl.isAbsoluteUrl('/example/example1')).toBeFalsy();
})

test('It detects an external url', () => {
    const testUrl = new CustomUrl('http://example.com');

    expect(testUrl.isExternal('http://example.com')).toBeFalsy();
    expect(testUrl.isExternal('http://example.com/internal/path')).toBeFalsy();
    expect(testUrl.isExternal('http://subdomain.example.com')).toBeTruthy();
    expect(testUrl.isExternal('http://subdomain.example.com/internal/path')).toBeTruthy();
    expect(testUrl.isExternal('http://example1.com')).toBeTruthy();
    expect(testUrl.isExternal('#example')).toBeFalsy();
    expect(testUrl.isExternal('example')).toBeFalsy();
    expect(testUrl.isExternal('example/example1#someId')).toBeFalsy();
});

test('It detects the type of internal urls', () => {
    const testUrl = new CustomUrl('http://example.com');

    expect(testUrl.getType('http://example.com')).toBe('equal');
    expect(testUrl.getType('http://example.com/internal')).toBe('internal');
    expect(testUrl.getType('http://example1.com/internal')).toBe('external');
    expect(testUrl.getType('internal')).toBe('internal');
    expect(testUrl.getType('/internal')).toBe('internal');
    expect(testUrl.getType('#internal')).toBe('scroll');
    expect(testUrl.getType('/somewhere#internal')).toBe('internalScroll');
    expect(testUrl.getType('/internal/path/so#ewhere#internal')).toBe('internalScroll');
    expect(testUrl.getType('/internal/path/so#ewhere#internal?cat=animal&duck=bird')).toBe('internalScroll');
});

test('It returns the scroll id if present', () => {
    const testUrl = new CustomUrl('http://example.com');

    expect(testUrl.scrollId('http://example.com')).toBeFalsy();
    expect(testUrl.scrollId('http://example1.com')).toBeFalsy();
    expect(testUrl.scrollId('internal')).toBeFalsy();
    expect(testUrl.scrollId('/internal')).toBeFalsy();
    expect(testUrl.scrollId('#internal')).toBe('#internal');
    expect(testUrl.scrollId('/internal/path/so#ewhere#path')).toBe('#path');
    expect(testUrl.scrollId('/internal/path/so#ewhere#duck?cat=animal&duck=bird')).toBe('#duck');
});

test('It generates an absolute url if its internal', () => {
    const documentHref = 'http://example.com';
    const testUrl = new CustomUrl(documentHref);

    expect(testUrl.absoluteUrl('https://other-domain.net')).toBe('https://other-domain.net');
    expect(testUrl.absoluteUrl('internal')).toBe(documentHref + '/internal');
    expect(testUrl.absoluteUrl('/internal')).toBe(documentHref + '/internal');
    expect(testUrl.absoluteUrl('#internal')).toBe(documentHref + '/#internal');
    expect(testUrl.absoluteUrl('/internal/path/so#ewhere#path')).toBe(documentHref + '/internal/path/so#ewhere#path');
    expect(testUrl.absoluteUrl('/internal/path/so#ewhere#duck?cat=animal&duck=bird')).toBe(documentHref + '/internal/path/so#ewhere#duck?cat=animal&duck=bird');
});

test('It generates a json url', () => {
    const documentHref = 'http://example.com';
    const testUrl = new CustomUrl(documentHref);

    expect(testUrl.jsonUrl('https://other-domain.net')).toBeFalsy();
    expect(testUrl.jsonUrl(documentHref + '/some/resource')).toBe(documentHref + '/some/resource.json');
    expect(testUrl.jsonUrl('internal')).toBe(documentHref + '/internal.json');
    expect(testUrl.jsonUrl('/internal')).toBe(documentHref + '/internal.json');
    expect(testUrl.jsonUrl('#internal')).toBeFalsy();
    expect(testUrl.jsonUrl('/internal/path/so#ewhere#path')).toBe(documentHref + '/internal/path/so.json');
    expect(testUrl.jsonUrl('/internal/path/so#ewhere#duck?cat=animal&duck=bird')).toBe(documentHref + '/internal/path/so.json');
});
