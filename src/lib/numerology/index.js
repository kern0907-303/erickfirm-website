const DAY_MS = 24 * 60 * 60 * 1000;

function deepFreezeTable(table) {
  for (const row of Object.values(table)) Object.freeze(row);
  return Object.freeze(table);
}

export const LUNAR_TABLE = deepFreezeTable({
  "1900": {
    "new_year": "1900-01-31",
    "code": "08|1100101101101"
  },
  "1901": {
    "new_year": "1901-02-19",
    "code": "00|0100101011100"
  },
  "1902": {
    "new_year": "1902-02-08",
    "code": "00|1010010101110"
  },
  "1903": {
    "new_year": "1903-01-29",
    "code": "05|0101001001101"
  },
  "1904": {
    "new_year": "1904-02-16",
    "code": "00|1101001001100"
  },
  "1905": {
    "new_year": "1905-02-04",
    "code": "00|1101100101010"
  },
  "1906": {
    "new_year": "1906-01-25",
    "code": "04|0110101010101"
  },
  "1907": {
    "new_year": "1907-02-13",
    "code": "00|0101011010100"
  },
  "1908": {
    "new_year": "1908-02-02",
    "code": "00|1001101011010"
  },
  "1909": {
    "new_year": "1909-01-22",
    "code": "02|0100101011101"
  },
  "1910": {
    "new_year": "1910-02-10",
    "code": "00|0100101011100"
  },
  "1911": {
    "new_year": "1911-01-30",
    "code": "06|1010010011011"
  },
  "1912": {
    "new_year": "1912-02-18",
    "code": "00|1010010011010"
  },
  "1913": {
    "new_year": "1913-02-06",
    "code": "00|1101001001010"
  },
  "1914": {
    "new_year": "1914-01-26",
    "code": "05|1101010100101"
  },
  "1915": {
    "new_year": "1915-02-14",
    "code": "00|1011010101000"
  },
  "1916": {
    "new_year": "1916-02-03",
    "code": "00|1101011010100"
  },
  "1917": {
    "new_year": "1917-01-23",
    "code": "02|1001011011010"
  },
  "1918": {
    "new_year": "1918-02-11",
    "code": "00|1001010110110"
  },
  "1919": {
    "new_year": "1919-02-01",
    "code": "07|0100100110111"
  },
  "1920": {
    "new_year": "1920-02-20",
    "code": "00|0100100101110"
  },
  "1921": {
    "new_year": "1921-02-08",
    "code": "00|1010010010110"
  },
  "1922": {
    "new_year": "1922-01-28",
    "code": "05|1011001001011"
  },
  "1923": {
    "new_year": "1923-02-16",
    "code": "00|0110101001010"
  },
  "1924": {
    "new_year": "1924-02-05",
    "code": "00|0110110101000"
  },
  "1925": {
    "new_year": "1925-01-24",
    "code": "04|1010110110101"
  },
  "1926": {
    "new_year": "1926-02-13",
    "code": "00|0010101101100"
  },
  "1927": {
    "new_year": "1927-02-02",
    "code": "00|1001010101110"
  },
  "1928": {
    "new_year": "1928-01-23",
    "code": "02|0100100101111"
  },
  "1929": {
    "new_year": "1929-02-10",
    "code": "00|0100100101110"
  },
  "1930": {
    "new_year": "1930-01-30",
    "code": "06|0110010010110"
  },
  "1931": {
    "new_year": "1931-02-17",
    "code": "00|1101010010100"
  },
  "1932": {
    "new_year": "1932-02-06",
    "code": "00|1110101001010"
  },
  "1933": {
    "new_year": "1933-01-26",
    "code": "05|0110110101001"
  },
  "1934": {
    "new_year": "1934-02-14",
    "code": "00|0101101011010"
  },
  "1935": {
    "new_year": "1935-02-04",
    "code": "00|0010101101100"
  },
  "1936": {
    "new_year": "1936-01-24",
    "code": "03|1001001101110"
  },
  "1937": {
    "new_year": "1937-02-11",
    "code": "00|1001001011100"
  },
  "1938": {
    "new_year": "1938-01-31",
    "code": "07|1100100101101"
  },
  "1939": {
    "new_year": "1939-02-19",
    "code": "00|1100100101010"
  },
  "1940": {
    "new_year": "1940-02-08",
    "code": "00|1101010010100"
  },
  "1941": {
    "new_year": "1941-01-27",
    "code": "06|1101101001010"
  },
  "1942": {
    "new_year": "1942-02-15",
    "code": "00|1011010101010"
  },
  "1943": {
    "new_year": "1943-02-05",
    "code": "00|0101011010100"
  },
  "1944": {
    "new_year": "1944-01-25",
    "code": "04|1010101011011"
  },
  "1945": {
    "new_year": "1945-02-13",
    "code": "00|0010010111010"
  },
  "1946": {
    "new_year": "1946-02-02",
    "code": "00|1001001011010"
  },
  "1947": {
    "new_year": "1947-01-22",
    "code": "02|1100100101011"
  },
  "1948": {
    "new_year": "1948-02-10",
    "code": "00|1010100101010"
  },
  "1949": {
    "new_year": "1949-01-29",
    "code": "07|1011010010101"
  },
  "1950": {
    "new_year": "1950-02-17",
    "code": "00|0110110010100"
  },
  "1951": {
    "new_year": "1951-02-06",
    "code": "00|1011010101010"
  },
  "1952": {
    "new_year": "1952-01-27",
    "code": "05|0101010110101"
  },
  "1953": {
    "new_year": "1953-02-14",
    "code": "00|0100110110100"
  },
  "1954": {
    "new_year": "1954-02-03",
    "code": "00|1010010110110"
  },
  "1955": {
    "new_year": "1955-01-24",
    "code": "03|0101001010111"
  },
  "1956": {
    "new_year": "1956-02-12",
    "code": "00|0101001010110"
  },
  "1957": {
    "new_year": "1957-01-31",
    "code": "08|1010100101010"
  },
  "1958": {
    "new_year": "1958-02-18",
    "code": "00|1110100101010"
  },
  "1959": {
    "new_year": "1959-02-08",
    "code": "00|0110101010100"
  },
  "1960": {
    "new_year": "1960-01-28",
    "code": "06|1010110101010"
  },
  "1961": {
    "new_year": "1961-02-15",
    "code": "00|1010101101010"
  },
  "1962": {
    "new_year": "1962-02-05",
    "code": "00|0100101101100"
  },
  "1963": {
    "new_year": "1963-01-25",
    "code": "04|1010010101110"
  },
  "1964": {
    "new_year": "1964-02-13",
    "code": "00|1010010101110"
  },
  "1965": {
    "new_year": "1965-02-02",
    "code": "00|0101001001100"
  },
  "1966": {
    "new_year": "1966-01-21",
    "code": "03|1110100100110"
  },
  "1967": {
    "new_year": "1967-02-09",
    "code": "00|1101100101010"
  },
  "1968": {
    "new_year": "1968-01-30",
    "code": "07|0101101010101"
  },
  "1969": {
    "new_year": "1969-02-17",
    "code": "00|0101011010100"
  },
  "1970": {
    "new_year": "1970-02-06",
    "code": "00|1001011011010"
  },
  "1971": {
    "new_year": "1971-01-27",
    "code": "05|0100101011101"
  },
  "1972": {
    "new_year": "1972-02-15",
    "code": "00|0100101011010"
  },
  "1973": {
    "new_year": "1973-02-03",
    "code": "00|1010010011010"
  },
  "1974": {
    "new_year": "1974-01-23",
    "code": "04|1101001001101"
  },
  "1975": {
    "new_year": "1975-02-11",
    "code": "00|1101001001010"
  },
  "1976": {
    "new_year": "1976-01-31",
    "code": "08|1101010100101"
  },
  "1977": {
    "new_year": "1977-02-18",
    "code": "00|1011010101000"
  },
  "1978": {
    "new_year": "1978-02-07",
    "code": "00|1011011010100"
  },
  "1979": {
    "new_year": "1979-01-28",
    "code": "06|1001011011010"
  },
  "1980": {
    "new_year": "1980-02-16",
    "code": "00|1001010110110"
  },
  "1981": {
    "new_year": "1981-02-05",
    "code": "00|0100100110110"
  },
  "1982": {
    "new_year": "1982-01-25",
    "code": "04|1010010010111"
  },
  "1983": {
    "new_year": "1983-02-13",
    "code": "00|1010010010110"
  },
  "1984": {
    "new_year": "1984-02-02",
    "code": "10|1011001001011"
  },
  "1985": {
    "new_year": "1985-02-20",
    "code": "00|0110101001010"
  },
  "1986": {
    "new_year": "1986-02-09",
    "code": "00|0110110101000"
  },
  "1987": {
    "new_year": "1987-01-29",
    "code": "06|1010110110100"
  },
  "1988": {
    "new_year": "1988-02-17",
    "code": "00|1010101101100"
  },
  "1989": {
    "new_year": "1989-02-06",
    "code": "00|1001010101110"
  },
  "1990": {
    "new_year": "1990-01-27",
    "code": "05|0100100101111"
  },
  "1991": {
    "new_year": "1991-02-15",
    "code": "00|0100100101110"
  },
  "1992": {
    "new_year": "1992-02-04",
    "code": "00|0110010010110"
  },
  "1993": {
    "new_year": "1993-01-23",
    "code": "03|0110101001010"
  },
  "1994": {
    "new_year": "1994-02-10",
    "code": "00|1110101001010"
  },
  "1995": {
    "new_year": "1995-01-31",
    "code": "08|0110101100101"
  },
  "1996": {
    "new_year": "1996-02-19",
    "code": "00|0101101011000"
  },
  "1997": {
    "new_year": "1997-02-07",
    "code": "00|1010101101100"
  },
  "1998": {
    "new_year": "1998-01-28",
    "code": "05|1001001101101"
  },
  "1999": {
    "new_year": "1999-02-16",
    "code": "00|1001001011100"
  },
  "2000": {
    "new_year": "2000-02-05",
    "code": "00|1100100101100"
  },
  "2001": {
    "new_year": "2001-01-24",
    "code": "04|1101010010101"
  },
  "2002": {
    "new_year": "2002-02-12",
    "code": "00|1101010010100"
  },
  "2003": {
    "new_year": "2003-02-01",
    "code": "00|1101101001010"
  },
  "2004": {
    "new_year": "2004-01-22",
    "code": "02|0101101010101"
  },
  "2005": {
    "new_year": "2005-02-09",
    "code": "00|0101011010100"
  },
  "2006": {
    "new_year": "2006-01-29",
    "code": "07|1010101011011"
  },
  "2007": {
    "new_year": "2007-02-18",
    "code": "00|0010010111010"
  },
  "2008": {
    "new_year": "2008-02-07",
    "code": "00|1001001011010"
  },
  "2009": {
    "new_year": "2009-01-26",
    "code": "05|1100100101011"
  },
  "2010": {
    "new_year": "2010-02-14",
    "code": "00|1010100101010"
  },
  "2011": {
    "new_year": "2011-02-03",
    "code": "00|1011010010100"
  },
  "2012": {
    "new_year": "2012-01-23",
    "code": "04|1011010101010"
  },
  "2013": {
    "new_year": "2013-02-10",
    "code": "00|1010110101010"
  },
  "2014": {
    "new_year": "2014-01-31",
    "code": "09|0101010110101"
  },
  "2015": {
    "new_year": "2015-02-19",
    "code": "00|0100101110100"
  },
  "2016": {
    "new_year": "2016-02-08",
    "code": "00|1010010110110"
  },
  "2017": {
    "new_year": "2017-01-28",
    "code": "06|0101001010111"
  },
  "2018": {
    "new_year": "2018-02-16",
    "code": "00|0101001010110"
  },
  "2019": {
    "new_year": "2019-02-05",
    "code": "00|1010100100110"
  },
  "2020": {
    "new_year": "2020-01-25",
    "code": "04|0111010010101"
  },
  "2021": {
    "new_year": "2021-02-12",
    "code": "00|0110101010100"
  },
  "2022": {
    "new_year": "2022-02-01",
    "code": "00|1010110101010"
  },
  "2023": {
    "new_year": "2023-01-22",
    "code": "02|0100110110101"
  },
  "2024": {
    "new_year": "2024-02-10",
    "code": "00|0100101101100"
  },
  "2025": {
    "new_year": "2025-01-29",
    "code": "06|1010010101110"
  },
  "2026": {
    "new_year": "2026-02-17",
    "code": "00|1010010011100"
  },
  "2027": {
    "new_year": "2027-02-06",
    "code": "00|1101001001100"
  },
  "2028": {
    "new_year": "2028-01-26",
    "code": "05|1110100100110"
  },
  "2029": {
    "new_year": "2029-02-13",
    "code": "00|1101010100110"
  },
  "2030": {
    "new_year": "2030-02-03",
    "code": "00|0101101010100"
  },
  "2031": {
    "new_year": "2031-01-23",
    "code": "03|0110101101010"
  },
  "2032": {
    "new_year": "2032-02-11",
    "code": "00|1001011011010"
  },
  "2033": {
    "new_year": "2033-01-31",
    "code": "11|0100101011101"
  },
  "2034": {
    "new_year": "2034-02-19",
    "code": "00|0100101011010"
  },
  "2035": {
    "new_year": "2035-02-08",
    "code": "00|1010010011010"
  },
  "2036": {
    "new_year": "2036-01-28",
    "code": "06|1101001001011"
  },
  "2037": {
    "new_year": "2037-02-15",
    "code": "00|1101001001010"
  },
  "2038": {
    "new_year": "2038-02-04",
    "code": "00|1101010100100"
  },
  "2039": {
    "new_year": "2039-01-24",
    "code": "05|1101101010100"
  },
  "2040": {
    "new_year": "2040-02-12",
    "code": "00|1011010110100"
  },
  "2041": {
    "new_year": "2041-02-01",
    "code": "00|0101011011010"
  },
  "2042": {
    "new_year": "2042-01-22",
    "code": "02|0100101011011"
  },
  "2043": {
    "new_year": "2043-02-10",
    "code": "00|0100100110110"
  },
  "2044": {
    "new_year": "2044-01-30",
    "code": "07|1010010010111"
  },
  "2045": {
    "new_year": "2045-02-17",
    "code": "00|1010010010110"
  },
  "2046": {
    "new_year": "2046-02-06",
    "code": "00|1010101001010"
  },
  "2047": {
    "new_year": "2047-01-26",
    "code": "05|1011010100101"
  },
  "2048": {
    "new_year": "2048-02-14",
    "code": "00|0110110100100"
  },
  "2049": {
    "new_year": "2049-02-02",
    "code": "00|1010110110100"
  },
  "2050": {
    "new_year": "2050-01-23",
    "code": "03|0101010110110"
  },
  "2051": {
    "new_year": "2051-02-11",
    "code": "00|1001001101110"
  },
  "2052": {
    "new_year": "2052-02-01",
    "code": "08|0100100101111"
  },
  "2053": {
    "new_year": "2053-02-19",
    "code": "00|0100100101110"
  },
  "2054": {
    "new_year": "2054-02-08",
    "code": "00|0110010010110"
  },
  "2055": {
    "new_year": "2055-01-28",
    "code": "06|0110101001010"
  },
  "2056": {
    "new_year": "2056-02-15",
    "code": "00|1110101001010"
  },
  "2057": {
    "new_year": "2057-02-04",
    "code": "00|0110101100100"
  },
  "2058": {
    "new_year": "2058-01-24",
    "code": "04|1010101101100"
  },
  "2059": {
    "new_year": "2059-02-12",
    "code": "00|1010101011100"
  },
  "2060": {
    "new_year": "2060-02-02",
    "code": "00|1001001011100"
  },
  "2061": {
    "new_year": "2061-01-21",
    "code": "03|1100100101110"
  },
  "2062": {
    "new_year": "2062-02-09",
    "code": "00|1100100101100"
  },
  "2063": {
    "new_year": "2063-01-29",
    "code": "07|1101010010101"
  },
  "2064": {
    "new_year": "2064-02-17",
    "code": "00|1101010010100"
  },
  "2065": {
    "new_year": "2065-02-05",
    "code": "00|1101101001010"
  },
  "2066": {
    "new_year": "2066-01-26",
    "code": "05|0101101010101"
  },
  "2067": {
    "new_year": "2067-02-14",
    "code": "00|0101011010100"
  },
  "2068": {
    "new_year": "2068-02-03",
    "code": "00|1010011011010"
  },
  "2069": {
    "new_year": "2069-01-23",
    "code": "04|0101001011101"
  },
  "2070": {
    "new_year": "2070-02-11",
    "code": "00|0101001011010"
  },
  "2071": {
    "new_year": "2071-01-31",
    "code": "08|1010100101011"
  },
  "2072": {
    "new_year": "2072-02-19",
    "code": "00|1010100101010"
  },
  "2073": {
    "new_year": "2073-02-07",
    "code": "00|1011010010100"
  },
  "2074": {
    "new_year": "2074-01-27",
    "code": "06|1011010101010"
  },
  "2075": {
    "new_year": "2075-02-15",
    "code": "00|1010110101010"
  },
  "2076": {
    "new_year": "2076-02-05",
    "code": "00|0101010110100"
  },
  "2077": {
    "new_year": "2077-01-24",
    "code": "04|1010010111010"
  },
  "2078": {
    "new_year": "2078-02-12",
    "code": "00|1010010110110"
  },
  "2079": {
    "new_year": "2079-02-02",
    "code": "00|0101001010110"
  },
  "2080": {
    "new_year": "2080-01-22",
    "code": "03|1010100100111"
  },
  "2081": {
    "new_year": "2081-02-09",
    "code": "00|0110100100110"
  },
  "2082": {
    "new_year": "2082-01-29",
    "code": "07|0111001010011"
  },
  "2083": {
    "new_year": "2083-02-17",
    "code": "00|0110101010100"
  },
  "2084": {
    "new_year": "2084-02-06",
    "code": "00|1010110101010"
  },
  "2085": {
    "new_year": "2085-01-26",
    "code": "05|0100110110101"
  },
  "2086": {
    "new_year": "2086-02-14",
    "code": "00|0100101101100"
  },
  "2087": {
    "new_year": "2087-02-03",
    "code": "00|1010010101110"
  },
  "2088": {
    "new_year": "2088-01-24",
    "code": "04|0101001001110"
  },
  "2089": {
    "new_year": "2089-02-10",
    "code": "00|1101001001100"
  },
  "2090": {
    "new_year": "2090-01-30",
    "code": "08|1110100100110"
  },
  "2091": {
    "new_year": "2091-02-18",
    "code": "00|1101010100100"
  },
  "2092": {
    "new_year": "2092-02-07",
    "code": "00|1101101010100"
  },
  "2093": {
    "new_year": "2093-01-27",
    "code": "06|0110101101010"
  },
  "2094": {
    "new_year": "2094-02-15",
    "code": "00|0101011011010"
  },
  "2095": {
    "new_year": "2095-02-05",
    "code": "00|0100101011100"
  },
  "2096": {
    "new_year": "2096-01-25",
    "code": "04|1010010011101"
  },
  "2097": {
    "new_year": "2097-02-12",
    "code": "00|1010010011010"
  },
  "2098": {
    "new_year": "2098-02-01",
    "code": "00|1101000101010"
  },
  "2099": {
    "new_year": "2099-01-21",
    "code": "02|1101100100101"
  },
  "2100": {
    "new_year": "2100-02-09",
    "code": "00|1101010100100"
  }
});

function parseDateParts(value) {
  if (typeof value !== "string") {
    throw new TypeError("日期必須是 YYYY-MM-DD 或 YYYYMMDD 字串");
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    ?? /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (!match) throw new RangeError(`無效日期格式：${value}`);

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  if (
    year < 1
    || date.getUTCFullYear() !== year
    || date.getUTCMonth() + 1 !== month
    || date.getUTCDate() !== day
  ) {
    throw new RangeError(`無效日期：${value}`);
  }

  return { year, month, day, epoch: date.getTime() };
}

function getLunarYearSlots(year) {
  const row = LUNAR_TABLE[String(year)];
  if (!row) return null;

  const [leapText, monthBits] = row.code.split("|");
  const leapMonth = Number(leapText);
  if (
    !/^\d{2}$/.test(leapText)
    || !/^\d{13}$/.test(monthBits)
    || leapMonth > 12
  ) {
    throw new Error(`農曆表格式錯誤：${year}`);
  }

  const slots = [];
  let bitIndex = 0;
  for (let month = 1; month <= 12; month += 1) {
    slots.push({
      month,
      leap: false,
      days: monthBits[bitIndex] === "1" ? 30 : 29,
    });
    bitIndex += 1;

    if (leapMonth === month) {
      slots.push({
        month,
        leap: true,
        days: monthBits[bitIndex] === "1" ? 30 : 29,
      });
      bitIndex += 1;
    }
  }

  return { row, slots };
}

function solarToEpoch(date) {
  return parseDateParts(date).epoch;
}

export function solarToLunar(solarDate) {
  const solar = parseDateParts(solarDate);
  const years = Object.keys(LUNAR_TABLE).map(Number);
  let lunarYear = null;

  for (const year of years) {
    if (solar.epoch >= solarToEpoch(LUNAR_TABLE[String(year)].new_year)) {
      lunarYear = year;
    } else {
      break;
    }
  }

  if (lunarYear === null) {
    throw new RangeError(`日期超出農曆表範圍（1900–2100）：${solarDate}`);
  }

  const yearData = getLunarYearSlots(lunarYear);
  let offset = Math.floor((solar.epoch - solarToEpoch(yearData.row.new_year)) / DAY_MS);
  for (const slot of yearData.slots) {
    if (offset < slot.days) {
      return { y: lunarYear, m: slot.month, d: offset + 1, leap: slot.leap };
    }
    offset -= slot.days;
  }

  throw new RangeError(`日期超出農曆表範圍（1900–2100）：${solarDate}`);
}

function parseLunarBirth(value) {
  if (typeof value === "string") {
    const { year, month, day } = parseDateParts(value);
    return { year, month, day };
  }

  if (!value || typeof value !== "object") {
    throw new TypeError("農曆生日必須是日期字串或 { y, m, d } 物件");
  }

  const year = Number(value.y ?? value.year);
  const month = Number(value.m ?? value.month);
  const day = Number(value.d ?? value.day);
  if (
    !Number.isInteger(year) || year < 1 || year > 9999
    || !Number.isInteger(month) || month < 1 || month > 12
    || !Number.isInteger(day) || day < 1 || day > 30
  ) {
    throw new RangeError("無效農曆生日；月份須為 1–12，日期須為 1–30");
  }

  return { year, month, day };
}

function digitPath(source) {
  let sum = [...source].reduce((total, digit) => total + Number(digit), 0);
  const steps = [sum];
  while (sum > 9) {
    sum = String(sum).split("").reduce((total, digit) => total + Number(digit), 0);
    steps.push(sum);
  }

  const first = String(steps[0]).padStart(2, "0");
  const remaining = steps.length > 1 ? steps.slice(1) : [steps[0]];
  return {
    source,
    steps,
    num: sum,
    path: `+${[first, ...remaining].join("/")}`,
  };
}

function compactYearMonthDay(year, month, day) {
  return `${String(year).padStart(4, "0")}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
}

function calculateForParts(birth, target) {
  const targetMonthDay = target.month * 100 + target.day;
  const birthMonthDay = birth.month * 100 + birth.day;
  const flowYear = target.year - (targetMonthDay < birthMonthDay ? 1 : 0);
  const flowMonth = target.day < birth.day
    ? (target.month === 1 ? 12 : target.month - 1)
    : target.month;

  return {
    flowYear: digitPath(compactYearMonthDay(flowYear, birth.month, birth.day)),
    flowMonth: digitPath(compactYearMonthDay(birth.year, flowMonth, birth.day)),
    flowDay: digitPath(compactYearMonthDay(birth.year, birth.month, target.day)),
  };
}

export function calculateFlows(birthDate, targetDate) {
  return calculateForParts(parseDateParts(birthDate), parseDateParts(targetDate));
}

export function calculateLunarFlows(lunarBirth, targetSolarDate) {
  const birth = parseLunarBirth(lunarBirth);
  const targetLunar = solarToLunar(targetSolarDate);
  const flows = calculateForParts(birth, {
    year: targetLunar.y,
    month: targetLunar.m,
    day: targetLunar.d,
  });

  return { targetLunar, ...flows };
}
