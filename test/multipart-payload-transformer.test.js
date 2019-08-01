import { fixture, assert } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../multipart-payload-transformer.js';

describe('<multipart-payload-transformer>', function() {
  async function basicFixture() {
    return (await fixture(`<multipart-payload-transformer></multipart-payload-transformer>`));
  }

  function createFormData() {
    const fd = new FormData();
    fd.append('test-image', new Blob(['.'], {type: 'image/jpg'}), 'test.jpg');
    fd.append('test-unknown-mime', new Blob(['.']));
    fd.append('test-text', 'test');
    return fd;
  }

  function hasAdvancedSupport() {
    try {
      const fd = new FormData();
      fd.append('test', new Blob(['.'], {type: 'image/jpg'}), 'test.jpg');
      return ('entries' in fd);
    } catch (e) {
      return false;
    }
  }

  const hasFormData = hasAdvancedSupport();

  describe('generateMessage()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    (hasFormData ? it : it.skip)('Creates ArrayBuffer', async () => {
      element.formData = createFormData();
      const message = await element.generateMessage();
      assert.typeOf(message, 'arraybuffer');
    });

    (hasFormData ? it : it.skip)('Fires content-type-changed event', async () => {
      const spy = sinon.stub();
      element.addEventListener('content-type-changed', spy);
      element.formData = createFormData();
      await element.generateMessage();
      assert.isTrue(spy.calledOnce);
    });

    (hasFormData ? it : it.skip)('Fires multipart-boundary-changed event', async () => {
      const spy = sinon.stub();
      element.addEventListener('multipart-boundary-changed', spy);
      element.formData = createFormData();
      await element.generateMessage();
      assert.isTrue(spy.calledOnce);
    });

    (hasFormData ? it : it.skip)('contentType is set', async () => {
      let handlerContentType;
      element.addEventListener('content-type-changed', function(e) {
        handlerContentType = e.detail.value;
      });
      element.formData = createFormData();
      await element.generateMessage();

      assert.typeOf(element.contentType, 'string');
      assert.equal(element.contentType, handlerContentType);
    });

    (hasFormData ? it : it.skip)('boundary is set', async () => {
      let handlerBoundary;
      element.addEventListener('multipart-boundary-changed', function(e) {
        handlerBoundary = e.detail.value;
      });
      element.formData = createFormData();
      await element.generateMessage();
      assert.typeOf(element.boundary, 'string');
      assert.equal(element.boundary, handlerBoundary);
    });
  });

  describe('generatePreview()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Rejects when no formData', () => {
      element.formData = undefined;
      return element.generatePreview()
      .then(() => {
        throw new Error('Should not resolve');
      })
      .catch((cause) => {
        assert.equal(cause.message, 'The FormData property is not set.');
      });
    });

    (hasFormData ? it : it.skip)('Creates String', async () => {
      element.formData = createFormData();
      const message = await element.generatePreview();
      assert.typeOf(message, 'string');
    });

    (hasFormData ? it : it.skip)('Fires content-type-changed event', async () => {
      const spy = sinon.stub();
      element.addEventListener('content-type-changed', spy);
      element.formData = createFormData();
      await element.generatePreview();
      assert.isTrue(spy.calledOnce);
    });

    (hasFormData ? it : it.skip)('Fires multipart-boundary-changed event', async () => {
      const spy = sinon.stub();
      element.addEventListener('multipart-boundary-changed', spy);
      element.formData = createFormData();
      await element.generatePreview();
      assert.isTrue(spy.calledOnce);
    });
  });

  describe('arrayBufferToString()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function getView(str) {
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return bufView;
    }

    function str2ab(str) {
      const buf = new ArrayBuffer(str.length);
      const bufView = new Uint8Array(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return buf;
    }

    it('Coverts array buffer to string', () => {
      const ab = str2ab('test');
      const result = element.arrayBufferToString(ab);
      assert.equal(result, 'test');
    });

    it('Coverts Uint array to string', () => {
      const ab = getView('test');
      const result = element.arrayBufferToString(ab);
      assert.equal(result, 'test');
    });
  });

  describe('onboundary', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onboundary);
      const f = () => {};
      element.onboundary = f;
      assert.isTrue(element.onboundary === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onboundary = f;
      element.boundary = 'test';
      element.onboundary = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onboundary = f1;
      element.onboundary = f2;
      element.boundary = 'test';
      element.onboundary = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('contentType', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.oncontenttype);
      const f = () => {};
      element.oncontenttype = f;
      assert.isTrue(element.oncontenttype === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.oncontenttype = f;
      element.contentType = 'test';
      element.oncontenttype = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.oncontenttype = f1;
      element.oncontenttype = f2;
      element.contentType = 'test';
      element.oncontenttype = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('is accessible', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('sets aria-hidden attribute', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('aria-hidden'), 'true');
    });
  });
});
