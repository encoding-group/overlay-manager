class InternalUrl {
    constructor(url) {
        this.url = url;
        this.codeLookup = {
            '00': 'internal',
            '01': 'scroll',
            '10': 'internal',
            '11': 'internalScroll'
        }

        let urlFragments = this.url.split('#');
        if (urlFragments.length < 2) return;

        this.scrollIdString = '#' + urlFragments[urlFragments.length - 1];

        if(urlFragments[0] === '') return;
        urlFragments = urlFragments.splice(urlFragments.length - 1, 1);
        this.path = urlFragments.join('#');
    }

    getType() {
        let code = '';
        code += this.path ? '1' : '0';
        code += this.scrollIdString ? '1' : '0';

        return this.codeLookup[code];
    }

    scrollId() {
        return this.scrollIdString;
    }
}

module.exports = InternalUrl;