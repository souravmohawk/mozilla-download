import { assert } from 'chai';
import fs from 'fs';
import detectOS from '../src/detectos';
import main from '../src/main';
import { tempdir } from '../src/temp';

suite('main', function() {
  let cases = [
    {
      name: 'ff 64 bit linux mozilla-central',
      args: {
        product: 'firefox',
        os: 'linux-x86_64',
        branch: 'mozilla-central'
      },
      verify: function() {
        let dir = this.args.dest + '/firefox';
        assert.ok(fs.existsSync(dir), 'No ff dir in ' + this.args.dest);
        let contents = fs.readdirSync(dir);
        assert.include(contents, 'firefox', 'No ff bin in ' + dir);
      }
    },
    {
      name: 'ff mozilla-aurora crash reporter symbols',
      args: {
        product: 'firefox',
        os: 'linux-x86_64',
        branch: 'mozilla-aurora',
        fileSuffix: 'crashreporter-symbols.zip'
      },
      verify: function() {
        let dir = this.args.dest;
        let contents = fs.readdirSync(dir);
        assert.operator(contents.length, '>', 0);
      }
    },
    {
      name: 'ff win32 mozilla-inbound',
      args: {
        product: 'firefox',
        os: 'win32',
        branch: 'mozilla-inbound'
      },
      verify: function() {
        let dir = this.args.dest + '/firefox';
        assert.ok(fs.existsSync(dir), 'No ff dir in ' + this.args.dest);
        let contents = fs.readdirSync(dir);
        assert.include(contents, 'firefox.exe', 'No ff exe in ' + dir);
      }
    },
    {
      name: 'ff mac b2g-inbound',
      args: {
        product: 'firefox',
        os: 'mac64',
        branch: 'b2g-inbound'
      },
      verify: function() {
        let dir = this.args.dest + '/firefox';
        assert.ok(fs.existsSync(dir), 'No ff dir in ' + this.args.dest);
        let contents = fs.readdirSync(dir);
        assert.include(contents, 'Contents', 'No Contents in ' + dir);
      }
    }
  ];

  cases.forEach(testCase => {
    test(testCase.name, async function() {
      let os = detectOS();
      if (os === 'mac64' && isLinux(testCase.args.os) ||
          isLinux(os) && testCase.args.os === 'mac64') {
        return;
      }

      let dest = await tempdir();
      testCase.args.dest = dest;
      await main(testCase.args);
      testCase.verify();
    });
  });
});

function isLinux(os) {
  return os.indexOf('linux') !== -1;
}