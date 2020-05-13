const chai = require('chai');

const { expect } = chai;
const redirectHelper = require('../../../helpers/redirect');

describe('Redirect Helper tests', () => {
	it('redirects to absolute URL', () => {
		expect(redirectHelper.getValidRedirect('https://example.com')).to.equal('/');
	});

	it('redirects to absolute URL with path', () => {
		expect(redirectHelper.getValidRedirect('https://example.com/hello/world')).to.equal('/hello/world');
	});

	it('redirects to valid relativ URL', () => {
		expect(redirectHelper.getValidRedirect('/hello/world')).to.equal('/hello/world');
	});

	it('collaps leading slashes in relative URL', () => {
		expect(redirectHelper.getValidRedirect('//hello/world')).to.equal('/hello/world');
	});

	it('adds leading slash to relative URL', () => {
		expect(redirectHelper.getValidRedirect('hello/world')).to.equal('/hello/world');
	});
});
