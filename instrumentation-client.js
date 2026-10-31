import { initBotId } from 'botid/client/core';

// Protect both URL forms because this site uses trailing slashes. The Basic
// check is explicitly selected so this does not opt into paid Deep Analysis.
if (process.env.NEXT_PUBLIC_CONTACT_BOTID === '1') {
  initBotId({
    protect: [
      { path: '/api/send-email', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      { path: '/api/send-email/', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      { path: '/api/add-booking', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      { path: '/api/add-booking/', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      { path: '/api/reviews', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      { path: '/api/reviews/', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      { path: '/api/login', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      { path: '/api/login/', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
    ],
  });
}
