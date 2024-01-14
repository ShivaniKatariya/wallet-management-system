const { v4: uuidv4 } = require('uuid');

exports.generateUUID = () => {
  const uuid = uuidv4();
  return uuid;
};

exports.formatHumanReadableDate = (inputDate = '') => {
  const date = new Date(inputDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };

  return date.toLocaleString('en-US', options);
}

exports.formatDateStripTime = (inputDate = '') => {
  const date = new Date(inputDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour12: true };

  return date.toLocaleString('en-US', options);
}

const isDate = (value) => {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value);
};

exports.formatIfDate = (input) => {
  if (input && isDate(new Date(input)))
    return this.formatHumanReadableDate(new Date(input));
  return input;
}

const formatThousandsSeparator = (num) => {
  const [valueBeforeDecimal, valueAfterDecimal] = num.split('.');
  const formattedValue = valueBeforeDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + (valueAfterDecimal ? `${valueAfterDecimal}` : '');
  return formattedValue;
}

exports.formatAmount = (amount) => {
  const withoutTrailingZeros = parseFloat(amount).toFixed(4);
  return 'Rs. ' + formatThousandsSeparator(withoutTrailingZeros);
}
exports.isValidAmount = (amount) => {
  // ten digits before decimal, 4 digits after decimal, should be numbers only
  return /^[0-9]{0,10}(\.[0-9]{0,4})?$/.test(amount);
}