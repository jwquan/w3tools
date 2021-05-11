function convertNumberToWords(e) {
    var a = 'u',
        t = e.split(".");
    2 < t.length ? editor2.setValue("Invalid Number") : "i" == a ? 1 == t.length ? editor2.setValue(NumberToWordsIndia(e).toUpperCase()) : editor2.setValue(NumberToWordsIndia(t[0]).toUpperCase() + " POINT " + NumberToWordsIndia(t[1]).toUpperCase()) : (e = 1 == t.length ? NumberToWordsUSA(e) : NumberToWordsUSA(t[0]) + " POINT " + NumberToWordsUSA(t[1]), "u" == a ? editor2.setValue(e.toUpperCase()) : "b" == a ? editor2.setValue(convertUSAtoBritish(e).toUpperCase()) : "e" == a && editor2.setValue(convertUSAtoEuro(e).toUpperCase()))
}
function NumberToWordsUSA(e) {
    if (0 === e) return "zero";
    var d = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"],
        h = ["", "", "twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety"],
        b = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"];

    function m(e) {
        return ("000" + e).substr(-3)
    }

    function p(e) {
        return e.substr(0, e.length - 3)
    }
    return function e(a, t, r, i) {
        return "000" == r && 0 === i.length ? a : e((n = a, s = r[0], c = r[1], u = r[2], o = ("0" == s ? "" : d[s] + " hundred ") + ("0" == u ? h[c] : h[c] && h[c] + "-" || "") + (d[c + u] || d[u]), l = b[t], o ? o + (l && " " + l || "") + " " + n : n), ++t, m(i), p(i));
        var n, o, l, s, c, u
    }("", 0, m(String(e)), p(String(e)))
}