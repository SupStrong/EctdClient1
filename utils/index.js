// 编辑器自定义事件
var cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
export default function chineseJs(n) {
  var s = '';
  n = '' + n; // 数字转为字符串
  for (var i = 0; i < n.length; i++) {
    s += cnum[parseInt(n.charAt(i))];
  }
  if (s.length === 2) { // 两位数的时候
    // 如果个位数是0的时候，0改成十
    if (s.charAt(1) === cnum[0]) {
      s = s.charAt(0) + cnum[10];
      // 如果是一十改成十
      if (s === cnum[1] + cnum[10]) {
        s = cnum[10]
      }
    } else if (s.charAt(0) === cnum[1]) {
      // 如果十位数是一的话改成十
      s = cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[2]) {
      // 如果十位数是二的话改成十二
      s = cnum[2] + cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[3]) {
      s = cnum[3] + cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[4]) {
      s = cnum[4] + cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[5]) {
      s = cnum[5] + cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[6]) {
      s = cnum[6] + cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[7]) {
      s = cnum[7] + cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[8]) {
      s = cnum[8] + cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[9]) {
      s = cnum[9] + cnum[10] + s.charAt(1);
    } else if (s.charAt(0) === cnum[10]) {
      s = cnum[10] + cnum[10] + s.charAt(1);
    }

  }
  return s;
}
