import test from 'ava';

import { formatScope, combineTypeScope, formatMessage } from '../../lib/helpers/formatters';

test('FORMATSCOPE | should format scope correctly', (t) => {
  const scope = formatScope();

  t.is(scope, '');
});

test('FORMATSCOPE | should trim scope', (t) => {
  const scope = formatScope('         te st  ');

  t.is(scope, '(te st)');
});

test('COMBINETYPESCOPE | should combine type and scope correctly', (t) => {
  const typeScope = combineTypeScope('myType', 'myScope');

  t.is(typeScope, 'myType (myScope):');
});

test('COMBINETYPESCOPE | should combine type and empty scope', (t) => {
  const typeScope = combineTypeScope('myType');

  t.is(typeScope, 'myType:');
});

test('COMBINETYPESCOPE | should combine type with : and scope', (t) => {
  const typeScope = combineTypeScope('myType:', 'myScope');

  t.is(typeScope, 'myType (myScope):');
});

test('COMBINETYPESCOPE | should combine type with another delimiter', (t) => {
  const typeScope = combineTypeScope('myType:', 'myScope', ' -     ');
  const typeScope2 = combineTypeScope('myType:', 'myScope', ' =');
  const typeScope3 = combineTypeScope('myType', 'myScope', ' -');

  t.is(typeScope, 'myType (myScope) -');
  t.is(typeScope2, 'myType (myScope) =');
  t.is(typeScope3, 'myType (myScope) -');
});

test('COMBINETYPESCOPE | should combine type with another delimiter but with no space between type | #79', (t) => {
  const typeScope = combineTypeScope('myType:', 'myScope', ' -     ');
  const typeScope2 = combineTypeScope('myType:', 'myScope', ' =', false);
  const typeScope3 = combineTypeScope('myType', 'myScope', undefined, false);
  const typeNoScope = combineTypeScope('myType', undefined, undefined, false);
  const typeNoScope2 = combineTypeScope('myType', undefined, undefined, true);

  t.is(typeScope, 'myType (myScope) -');
  t.is(typeScope2, 'myType(myScope) =');
  t.is(typeScope3, 'myType(myScope):');
  t.is(typeNoScope, 'myType:');
  t.is(typeNoScope2, 'myType:');
});

test('FORMATMESSAGE | should format message', (t) => {
  const message = formatMessage({
    type: 'myType',
    message: '     something      ',
  });

  t.is(message, 'myType: something');
});

test('FORMATMESSAGE | should format message with customType', (t) => {
  const message = formatMessage({
    message: '     something      ',
    customType: 'custom',
  });

  t.is(message, 'custom: something');
});

test('FORMATMESSAGE | should format with scope', (t) => {
  const message = formatMessage({
    type: 'myType',
    scope: 'myScope',
    message: '     something      ',
  });

  t.is(message, 'myType (myScope): something');
});

test('FORMATMESSAGE | should format message with body', (t) => {
  const message = formatMessage({
    type: 'myType',
    scope: 'myScope',
    body: true,
    editor: 'take this',
  });

  t.is(message, 'take this');
});

test('FORMATMESSAGE | should format message with argv overrides', (t) => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
    },
    {
      type: 'overwrite',
    },
  );

  t.is(message, 'overwrite (myScope): message');
});

test('FORMATMESSAGE | should format message with more argv overrides', (t) => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
    },
    {
      type: 'myTypeOverwrite',
      scope: 'myScopeOverwrite',
      message: 'messageOverwrite',
    },
  );

  t.is(message, 'myTypeOverwrite (myScopeOverwrite): messageOverwrite');
});

test('FORMATMESSAGE | should format when editor is undefined but body is set to true', (t) => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: true,
    },
  );

  t.is(message, 'myType (myScope): message');
});

test('FORMATMESSAGE | should format when editor is undefined but body is set to true, and no scopespace', (t) => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: true,
    },
    undefined,
    {
      addScopeSpace: false,
    },
  );

  t.is(message, 'myType(myScope): message');
});

test('FORMATMESSAGE | should take editor when editor is not undefined and body is set to true', (t) => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: true,
      editor: 'take this',
    },
  );

  t.is(message, 'take this');
});

test('FORMATMESSAGE | should format when editor is not undefined and body is set to false', (t) => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: false,
      editor: 'take this',
    },
  );

  t.is(message, 'myType (myScope): message');
});

test('FORMATMESSAGE | should format with a delimiter', (t) => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: false,
      editor: 'take this',
    },
    undefined,
    {
      delimiter: ' -',
    },
  );

  t.is(message, 'myType (myScope) - message');
});


test('FORMATMESSAGE | should format with a type specific delimiter', (t) => {
  const message = formatMessage(
    {
      type: 'myType',
      scope: 'myScope',
      message: 'message',
      body: false,
      editor: 'take this',
    },
    undefined,
    {
      delimiter: ' -',
      types: [
        { type: 'myType', delimiter: '---' },
      ],
    },
  );

  t.is(message, 'myType (myScope)--- message');
});
