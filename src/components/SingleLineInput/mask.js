const NON_DIGIT_RE = /[^\d]/g
const formatString = (matches, mask) =>
  mask.reduce((acc, el) => {
    if (typeof el === 'string') {
      acc += el;
    } else if (el.test(matches[0])) {
      acc += matches.shift();
    }
    return acc
  }, '')

const validateTime = value => {
  const splits = value.split(':');
  const h = ~~splits[0];
  const m = ~~splits[1];
  const hour = h > 23 ? '23' : h < 0 ? '00' : h < 10 ? `0${h}` : h;
  const minute = m > 60 ? '60' : m < 0 ? '00' : m < 10 ? `0${m}` : m;
  return `${hour}:${minute}`;
}

const validateDate = value => {
  let yearPadding = '';
  const splits = value.split('.');
  const y = ~~splits[2];
  const m = ~~splits[1];
  const d = ~~splits[0];

  const year = y > 9999 ? 9999 : y < 0 ? 1 : y
  const month = m > 12 ? 12 : m < 0 ? 0 : m

  const daysInMonth = (new Date(year, month, 0, 0, 0)).getDate();

  const day = d > daysInMonth ? daysInMonth : d < 0 ? 1 : d

  switch (String(year).length) {
    case 3: yearPadding = '0'; break;
    case 2: yearPadding = '00'; break;
    case 1: yearPadding = '000'; break;
  }

  const monthPadding = month < 10 ? '0' : '';
  const dayPadding = day < 10 ? '0' : '';

  return `${dayPadding}${day}.${monthPadding}${month}.${yearPadding}${year}`;
}

const validateDateTime = value => {
  const splits = value.split(' ');
  const date = validateDate(splits[0]);
  const time = validateTime(splits[1]);
  return `${date}' '${time}`;
}



export default mask => (value = '') => {
  switch (mask) {
    case 'latitude':
      const latSplits = value.replace(',', '.').split('.');
      const latMant = ~~latSplits[0].replace(NON_DIGIT_RE, '') || '0';
      let latExp = latSplits[1];
      let latValue = '';
      let latMantInt = /^\-/.test(latValue) ? `-${latMant}` : latMant;
      if (latMantInt < -90) latMantInt = '-90'
      else if (latMantInt > 90) latMantInt = '90';
      if (latExp) {
        latExp = latExp.replace(NON_DIGIT_RE, '');
        const dif = 6 - latExp.length;
        if (dif > 0) {
          for (const i = 0; i < dif; i++) latExp += '0';
        }
        latValue = `${latMantInt}.${latExp}`;
      } else {
        latValue = `${latMantInt}.000000`;
      }
      return parseFloat(latValue) ? value : void 0
    case 'longitude':
      const longSplits = value.replace(',', '.').split('.');
      const longMant = ~~longSplits[0].replace(NON_DIGIT_RE, '') || '0';
      let longExp = longSplits[1];
      let longValue = '';
      let longMantInt = /^\-/.test(longValue) ? `-${longMant}` : longMant;
      if (longMantInt < -90) longMantInt = '-180';
      else if (longMantInt > 90) longMantInt = '180';
      if (longExp) {
        longExp = longExp.replace(NON_DIGIT_RE, '');
        const dif = 6 - longExp.length;
        if (dif > 0) {
          for (const i = 0; i < dif; i++) longExp += '0';
        }
        longValue = `${longMantInt}.${longExp}`;
      } else {
        longValue = `${longMantInt}.000000`;
      }
      return parseFloat(longValue) ? longValue : void 0
    case 'file':
      if (!value) return
      return value.replace(/(\~|\#|\%|\&|\*|\{|\}|\\|\:|\<|\>|\?|\/|\||\"|\')/g, ' ');
    case 'title':
      if (!value) return
      const matches = value.match(/[a-zA-Zа-яА-ЯёЁ0-9_\-\.\s\(\)]/g) || [];
      return matches.join().replace(/\,/g, '');
    case 'counter':
      if (!value) return
      const counterMatches = value.match(/\d/g) || [];
      return counterMatches.length || value[0] === '-' ? counterMatches.join('') : '0'
    case 'number':
    case 'integer':
    case 'integerN':
      if (!value) return
      const intMatches = value.match(/\d/g) || [];
      const neg = mask === 'integerN' && value[0] === '-' ? '-' : '';
      return intMatches.length || neg ? `${neg}${intMatches.join('')}` : ''
    case 'float':
    case 'floatN':
      if (!value) return
      const negative = mask === 'floatN' && value[0] === '-' ? '-' : '';
      const floatValue = value.replace('-', '').replace(/(,)/g, '.');
      const floats = floatValue.split('.');
      const hasPoint = !!(floats.length === 2);
      const whole = floats[0];
      const fraction = typeof floats[1] === 'string' ? floats[1].replace(/\./g, '') : '';
      const wholeMatches = whole.match(/\d/g) || [];
      const fractionMatches = fraction.match(/\d/g) || [];
      if (fractionMatches.length || hasPoint) {
        return wholeMatches.length
          ? `${negative}${wholeMatches.join('')}.${fractionMatches.join('')}`
          : `${negative}0.${fractionMatches.join('')}`
      } else {
        return wholeMatches.length ? `${negative}${wholeMatches.join('')}` : negative
      }
    case 'email':
      if (!value) return
      const emailMatches = value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) || [];
      return emailMatches.length ? value : void 0
    case 'phone':
      if (!value) return
      value = value.replace(/^8/, "+7");
      const phoneMatches = value.match(/\d/g) || [];
      switch (phoneMatches.length) {
        case 5:
          return !/\+?\d\s\(\d\d\d\)/.test(value)
            ? formatString(phoneMatches, [/\d/, /\d/, /\d/, '-', /\d/, /\d/])
            : void 0
        case 11:
          phoneMatches[0] = phoneMatches[0] === '8' ? '7' : phoneMatches[0];
          return formatString(phoneMatches, ['+', /\d/, ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]);
        default: return void 0
      }
    case 'pc':
      if (!value) return
      const pcMatches = value.match(/\d/g) || [];
      return pcMatches.length === 7 ? formatString(pcMatches, [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]) : void 0
    case 'date':
      const dateNow = new Date;
      const dateMatches = value.match(/\d/g) || [];
      const dateValidate = x => validateDate(formatString(dateMatches, x));
      if (dateMatches.length) {
        switch (dateMatches.length) {
          case 1: return dateValidate(['0', /\d/, '.', '0', '1', '.', '1', '9', '0', '0']);
          case 2: return dateValidate([/\d/, /\d/, '.', '0', '1', '.', '1', '9', '0', '0']);
          case 3: return dateValidate([/\d/, /\d/, '.', /\d/, '1', '.', '1', '9', '0', '0']);
          case 4: return dateValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', '1', '9', '0', '0']);
          case 5: return dateValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, '9', '0', '0']);
          case 6: return dateValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, '0', '0']);
          case 7: return dateValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, '0']);
          case 8: return dateValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]);
          default: return dateNow.format('dd.MM.yyyy');
        }
      } else {
        return dateNow.format('dd.MM.yyyy');
      }
    case 'time':
      const timeNow = new Date;
      const timeMatches = value.match(/\d/g) || [];
      const timeValidate = x => validateTime(formatString(timeMatches, x));
      if (timeMatches.length) {
        switch (timeMatches.length) {
          case 1: return timeValidate([/\d/, '0', ':', '0', '0']);
          case 2: return timeValidate([/\d/, /\d/, ':', '0', '0']);
          case 3: return timeValidate([/\d/, /\d/, ':', /\d/, '0']);
          case 4: return timeValidate([/\d/, /\d/, ':', /\d/, /\d/]);
          default: return timeNow.format('HH:mm');
        }
      } else {
        return timeNow.format('HH:mm');
      }
    case 'dateTime':
      const dateTimeNow = new Date;
      const dateTimeMatches = value.match(/\d/g) || [];
      const dateTimeValidate = x => validateDateTime(formatString(dateTimeMatches, x));
      if (dateTimeMatches.length) {
        switch (dateTimeMatches.length) {
          case 1: return dateTimeValidate(['0', /\d/, '.', '0', '1', '.', '1', '9', '0', '0', ' ', '0', '0', ':', '0', '0']);
          case 2: return dateTimeValidate([/\d/, /\d/, '.', '0', '1', '.', '1', '9', '0', '0', ' ', '0', '0', ':', '0', '0']);
          case 3: return dateTimeValidate([/\d/, /\d/, '.', /\d/, '1', '.', '1', '9', '0', '0', ' ', '0', '0', ':', '0', '0']);
          case 4: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', '1', '9', '0', '0', ' ', '0', '0', ':', '0', '0']);
          case 5: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, '9', '0', '0', ' ', '0', '0', ':', '0', '0']);
          case 6: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, '0', '0', ' ', '0', '0', ':', '0', '0']);
          case 7: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, '0', ' ', '0', '0', ':', '0', '0']);
          case 8: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, ' ', '0', '0', ':', '0', '0']);
          case 9: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, '0', ':', '0', '0']);
          case 10: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', '0', '0']);
          case 11: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, '0']);
          case 12: return dateTimeValidate([/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/]);
          default: return dateTimeNow.format('dd.MM.yyyy HH:mm');
        }
      } else {
        return dateTimeNow.format('dd.MM.yyyy HH:mm');
      }
  }
}