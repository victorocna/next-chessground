/** Joins the truthy class names, so `classnames('a', off && 'b')` stays readable. */
const classnames = (...names) => names.filter(Boolean).join(' ');

export default classnames;
