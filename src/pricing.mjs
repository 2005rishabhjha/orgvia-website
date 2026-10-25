/** Public, indicative founding-customer pricing. Keep commercial terms here. */
export const PRICING = {
  note: 'Introductory pricing for new customers. Prices exclude applicable taxes. Final pricing and availability are confirmed during onboarding.',
  annualNote: 'Save 2 months with annual billing.',
  plans: [
    { id: 'starter', name: 'Starter', description: 'For small teams starting to organize HR operations.', monthly: 999, annual: 9990, included: 10, additional: 79, cta: 'Book a demo', href: '/demo/', features: ['Employee directory', 'Employee profiles', 'Attendance', 'Leave management', 'Employee records'] },
    { id: 'growth', name: 'Growth', description: 'For growing companies that need more structured people operations.', monthly: 2499, annual: 24990, included: 50, additional: 59, cta: 'Book a demo', href: '/demo/', recommended: true, features: ['Everything in Starter', 'Multiple office locations', 'Organization chart', 'Attendance exports', 'Enhanced leave workflows'] },
    { id: 'business', name: 'Business', description: 'For established teams managing more complex people workflows.', monthly: 4999, annual: 49990, included: 100, additional: 49, cta: 'Talk to sales', href: '/contact/', features: ['Everything in Growth', 'Recruitment', 'Employee onboarding', 'Performance management', 'Role management'] },
    { id: 'enterprise', name: 'Enterprise', description: 'For organizations that need a tailored configuration and commercial arrangement.', monthly: null, annual: null, included: null, additional: null, cta: 'Contact sales', href: '/contact/', features: ['Custom employee limits', 'Configurable modules', 'Multiple branches', 'Advanced administration', 'Onboarding arrangement'] },
  ],
  comparison: [
    ['People management', 'Included', 'Included', 'Included', 'Contact sales'],
    ['Attendance', 'Included', 'Included', 'Included', 'Contact sales'],
    ['Leave', 'Included', 'Enhanced workflows', 'Enhanced workflows', 'Contact sales'],
    ['Payroll workflows', 'Confirmed in quotation', 'Confirmed in quotation', 'Confirmed in quotation', 'Contact sales'],
    ['Recruitment', 'Not included', 'Not included', 'Included', 'Contact sales'],
    ['Onboarding', 'Not included', 'Not included', 'Included', 'Contact sales'],
    ['Performance', 'Not included', 'Not included', 'Included', 'Contact sales'],
    ['Organization administration', 'Employee records', 'Locations & org chart', 'Role management', 'Contact sales'],
    ['Reporting', 'Not included', 'Attendance exports', 'Attendance exports', 'Contact sales'],
    ['Support', 'Terms in quotation', 'Terms in quotation', 'Terms in quotation', 'Contact sales'],
  ],
};
