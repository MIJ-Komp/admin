const state = {
   user: null,
};

const mutations = {};

import axios from "../axios";
const actions = {
   getImage({ commit }, id) {
      return axios.get(`image/${id}`)
   },
   uploadImage({ commit }, image) {
      const data = new FormData();
      for (let i = 0; i < image.length; i++) {
         data.append("images", image[i]);
      }
      // data.append("images", image);

      return axios.post("/image", data, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });
   },
   async getAllCountries({ commit }) {
      let countries = await axios.get(`/region/getCountries/`)
      var indonesia = countries.find(data => data.Name.includes('Indonesia')) 
      if(indonesia) countries.unshift(indonesia)
      return countries;
   },
   getAllProvince({ commit }, countryId) {
      return axios.get(`/region/getProvinces/${countryId|| 1}`) // 1 Indonesia
      var provinces = [
         {
            Id: 1,
            Name: "DKI JAKARTA",
         },
         {
            Id: 2,
            Name: "BANTEN",
         },
         {
            Id: 3,
            Name: "JAWA BARAT",
         },
         {
            Id: 4,
            Name: "SUMATERA UTARA",
         },
         {
            Id: 5,
            Name: "NANGGROE ACEH DARUSSALAM (NAD)",
         },
         {
            Id: 6,
            Name: "SUMATERA BARAT",
         },
         {
            Id: 7,
            Name: "RIAU",
         },
         {
            Id: 8,
            Name: "KEPULAUAN RIAU",
         },
         {
            Id: 9,
            Name: "SUMATERA SELATAN",
         },
         {
            Id: 10,
            Name: "BANGKA BELITUNG",
         },
         {
            Id: 11,
            Name: "LAMPUNG",
         },
         {
            Id: 12,
            Name: "JAMBI",
         },
         {
            Id: 13,
            Name: "BENGKULU",
         },
         {
            Id: 14,
            Name: "JAWA TENGAH",
         },
         {
            Id: 15,
            Name: "DI YOGYAKARTA",
         },
         {
            Id: 16,
            Name: "JAWA TIMUR",
         },
         {
            Id: 17,
            Name: "KALIMANTAN SELATAN",
         },
         {
            Id: 18,
            Name: "KALIMANTAN TENGAH",
         },
         {
            Id: 19,
            Name: "KALIMANTAN TIMUR",
         },
         {
            Id: 20,
            Name: "KALIMANTAN UTARA",
         },
         {
            Id: 21,
            Name: "KALIMANTAN BARAT",
         },
         {
            Id: 22,
            Name: "BALI",
         },
         {
            Id: 23,
            Name: "NUSA TENGGARA BARAT (NTB)",
         },
         {
            Id: 24,
            Name: "NUSA TENGGARA TIMUR (NTT)",
         },
         {
            Id: 25,
            Name: "SULAWESI SELATAN",
         },
         {
            Id: 26,
            Name: "SULAWESI BARAT",
         },
         {
            Id: 27,
            Name: "SULAWESI TENGGARA",
         },
         {
            Id: 28,
            Name: "SULAWESI TENGAH",
         },
         {
            Id: 29,
            Name: "SULAWESI UTARA",
         },
         {
            Id: 30,
            Name: "GORONTALO",
         },
         {
            Id: 31,
            Name: "MALUKU",
         },
         {
            Id: 32,
            Name: "MALUKU UTARA",
         },
         {
            Id: 33,
            Name: "PAPUA",
         },
         {
            Id: 34,
            Name: "PAPUA BARAT",
         },
      ];
      return provinces;
   },
   getAllCities({ commit }, provinceId) {
      return axios.get(`/region/getCities/${provinceId}`)
      var cities = [
         //DKI Jakarta
         {
            Id: 1,
            Name: "JAKARTA PUSAT",
            provinceId: 1,
         },
         {
            Id: 2,
            Name: "JAKARTA BARAT",
            provinceId: 1,
         },
         {
            Id: 3,
            Name: "JAKARTA SELATAN",
            provinceId: 1,
         },
         {
            Id: 4,
            Name: "JAKARTA TIMUR",
            provinceId: 1,
         },
         {
            Id: 5,
            Name: "JAKARTA UTARA",
            provinceId: 1,
         },
         {
            Id: 6,
            Name: "KEPULAUAN SERIBU",
            provinceId: 1,
         },

         //Banten
         {
            Id: 7,
            Name: "TANGERANG",
            provinceId: 2,
         },
         {
            Id: 8,
            Name: "TANGERANG SELATAN",
            provinceId: 2,
         },
         {
            Id: 9,
            Name: "SERANG",
            provinceId: 2,
         },
         {
            Id: 10,
            Name: "PANDEGLANG",
            provinceId: 2,
         },
         {
            Id: 11,
            Name: "LEBAK",
            provinceId: 2,
         },
         {
            Id: 12,
            Name: "CILEGON",
            provinceId: 2,
         },

         //Jawab Barat
         {
            Id: 13,
            Name: "BOGOR",
            provinceId: 3,
         },
         {
            Id: 14,
            Name: "DEPOK",
            provinceId: 3,
         },
         {
            Id: 15,
            Name: "BEKASI",
            provinceId: 3,
         },
         {
            Id: 16,
            Name: "BANDUNG",
            provinceId: 3,
         },
         {
            Id: 17,
            Name: "BANDUNG BARAT",
            provinceId: 3,
         },
         {
            Id: 18,
            Name: "CIMAHI",
            provinceId: 3,
         },
         {
            Id: 19,
            Name: "PURWAKARTA",
            provinceId: 3,
         },
         {
            Id: 20,
            Name: "SUBANG",
            provinceId: 3,
         },
         {
            Id: 21,
            Name: "KARAWANG",
            provinceId: 3,
         },
         {
            Id: 22,
            Name: "SUKABUMI",
            provinceId: 3,
         },
         {
            Id: 23,
            Name: "CIANJUR",
            provinceId: 3,
         },
         {
            Id: 24,
            Name: "GARUT",
            provinceId: 3,
         },
         {
            Id: 25,
            Name: "CIREBON",
            provinceId: 3,
         },
         {
            Id: 26,
            Name: "INDRAMAYU",
            provinceId: 3,
         },
         {
            Id: 27,
            Name: "SUMEDANG",
            provinceId: 3,
         },
         {
            Id: 28,
            Name: "MAJALENGKA",
            provinceId: 3,
         },
         {
            Id: 29,
            Name: "KUNINGAN",
            provinceId: 3,
         },
         {
            Id: 30,
            Name: "TASIKMALAYA",
            provinceId: 3,
         },
         {
            Id: 31,
            Name: "CIAMIS",
            provinceId: 3,
         },
         {
            Id: 32,
            Name: "PANGANDARAN",
            provinceId: 3,
         },
         {
            Id: 33,
            Name: "BANJAR",
            provinceId: 3,
         },

         //Sumatera Utara
         {
            Id: 34,
            Name: "MEDAN",
            provinceId: 4,
         },
         {
            Id: 35,
            Name: "DELI SERDANG",
            provinceId: 4,
         },
         {
            Id: 36,
            Name: "TEBING TINGGI",
            provinceId: 4,
         },
         {
            Id: 37,
            Name: "BINJAI",
            provinceId: 4,
         },
         {
            Id: 38,
            Name: "LANGKAT",
            provinceId: 4,
         },
         {
            Id: 39,
            Name: "SERDANG BEDAGAI",
            provinceId: 4,
         },
         {
            Id: 40,
            Name: "PEMATANG SIANTAR",
            provinceId: 4,
         },
         {
            Id: 41,
            Name: "SIMALUNGUN",
            provinceId: 4,
         },
         {
            Id: 42,
            Name: "ASAHAN",
            provinceId: 4,
         },
         {
            Id: 43,
            Name: "BATU BARA",
            provinceId: 4,
         },
         {
            Id: 44,
            Name: "TANJUNG BALAI",
            provinceId: 4,
         },
         {
            Id: 45,
            Name: "LABUHAN BATU",
            provinceId: 4,
         },
         {
            Id: 46,
            Name: "LABUHAN BATU UTARA",
            provinceId: 4,
         },
         {
            Id: 47,
            Name: "LABUHAN BATU SELATAN",
            provinceId: 4,
         },
         {
            Id: 48,
            Name: "KARO",
            provinceId: 4,
         },
         {
            Id: 49,
            Name: "DAIRI",
            provinceId: 4,
         },
         {
            Id: 50,
            Name: "PAKPAK BHARAT",
            provinceId: 4,
         },
         {
            Id: 51,
            Name: "TOBA SAMOSIR",
            provinceId: 4,
         },
         {
            Id: 52,
            Name: "SAMOSIR",
            provinceId: 4,
         },
         {
            Id: 53,
            Name: "TAPANULI UTARA",
            provinceId: 4,
         },
         {
            Id: 54,
            Name: "HUMBANG HASUNDUTAN",
            provinceId: 4,
         },
         {
            Id: 55,
            Name: "SIBOLGA",
            provinceId: 4,
         },
         {
            Id: 56,
            Name: "TAPANULI TENGAH",
            provinceId: 4,
         },
         {
            Id: 57,
            Name: "PADANG SIDEMPUAN",
            provinceId: 4,
         },
         {
            Id: 58,
            Name: "TAPANULI SELATAN",
            provinceId: 4,
         },
         {
            Id: 59,
            Name: "PADANG LAWAS UTARA",
            provinceId: 4,
         },
         {
            Id: 60,
            Name: "PADANG LAWAS",
            provinceId: 4,
         },
         {
            Id: 61,
            Name: "GUNUNGSITOLI",
            provinceId: 4,
         },
         {
            Id: 62,
            Name: "NIAS BARAT",
            provinceId: 4,
         },
         {
            Id: 63,
            Name: "NIAS UTARA",
            provinceId: 4,
         },
         {
            Id: 64,
            Name: "NIAS",
            provinceId: 4,
         },
         {
            Id: 65,
            Name: "NIAS SELATAN",
            provinceId: 4,
         },
         {
            Id: 66,
            Name: "MANDAILING NATAL",
            provinceId: 4,
         },

         //NANGGROE ACEH DARUSSALAM (NAD)
         {
            Id: 67,
            Name: "BANDA ACEH",
            provinceId: 5,
         },
         {
            Id: 68,
            Name: "ACEH BESAR",
            provinceId: 5,
         },
         {
            Id: 69,
            Name: "SABANG",
            provinceId: 5,
         },
         {
            Id: 70,
            Name: "ACEH BARAT",
            provinceId: 5,
         },
         {
            Id: 71,
            Name: "ACEH JAYA",
            provinceId: 5,
         },
         {
            Id: 72,
            Name: "NAGAN RAYA",
            provinceId: 5,
         },
         {
            Id: 73,
            Name: "ACEH SELATAN",
            provinceId: 5,
         },
         {
            Id: 74,
            Name: "ACEH BARAT DAYA",
            provinceId: 5,
         },
         {
            Id: 75,
            Name: "SIMEULUE",
            provinceId: 5,
         },
         {
            Id: 76,
            Name: "PIDIE",
            provinceId: 5,
         },
         {
            Id: 77,
            Name: "PIDIE JAYA",
            provinceId: 5,
         },
         {
            Id: 78,
            Name: "BIREUEN",
            provinceId: 5,
         },
         {
            Id: 79,
            Name: "LHOKSEUMAWE",
            provinceId: 5,
         },
         {
            Id: 80,
            Name: "ACEH UTARA",
            provinceId: 5,
         },
         {
            Id: 81,
            Name: "LANGSA",
            provinceId: 5,
         },
         {
            Id: 82,
            Name: "ACEH TIMUR",
            provinceId: 5,
         },
         {
            Id: 83,
            Name: "ACEH TAMIANG",
            provinceId: 5,
         },
         {
            Id: 84,
            Name: "ACEH TENGAH",
            provinceId: 5,
         },
         {
            Id: 85,
            Name: "BENER MERIAH",
            provinceId: 5,
         },
         {
            Id: 86,
            Name: "ACEH TENGGARA",
            provinceId: 5,
         },
         {
            Id: 87,
            Name: "GAYO LUES",
            provinceId: 5,
         },
         {
            Id: 88,
            Name: "SUBULUSSALAM",
            provinceId: 5,
         },
         {
            Id: 89,
            Name: "ACEH SINGKIL",
            provinceId: 5,
         },

         // SUMATERA BARAT
         {
            Id: 90,
            Name: "PADANG",
            provinceId: 6,
         },
         {
            Id: 91,
            Name: "KEPULAUAN MENTAWAI",
            provinceId: 6,
         },
         {
            Id: 92,
            Name: "PARIAMAN",
            provinceId: 6,
         },
         {
            Id: 93,
            Name: "PADANG PARIAMAN",
            provinceId: 6,
         },
         {
            Id: 94,
            Name: "PESISIR SELATAN",
            provinceId: 6,
         },
         {
            Id: 95,
            Name: "BUKITTINGGI",
            provinceId: 6,
         },
         {
            Id: 96,
            Name: "AGAM",
            provinceId: 6,
         },
         {
            Id: 97,
            Name: "PAYAKUMBUH",
            provinceId: 6,
         },
         {
            Id: 98,
            Name: "LIMA PULUH KOTO/KOTA",
            provinceId: 6,
         },
         {
            Id: 99,
            Name: "PASAMAN",
            provinceId: 6,
         },
         {
            Id: 100,
            Name: "PASAMAN BARAT",
            provinceId: 6,
         },
         {
            Id: 101,
            Name: "PADANG PANJANG",
            provinceId: 6,
         },
         {
            Id: 102,
            Name: "TANAH DATAR",
            provinceId: 6,
         },
         {
            Id: 103,
            Name: "SOLOK",
            provinceId: 6,
         },
         {
            Id: 104,
            Name: "SAWAH LUNTO",
            provinceId: 6,
         },
         {
            Id: 105,
            Name: "SIJUNJUNG (SAWAH LUNTO SIJUNJUNG)",
            provinceId: 6,
         },
         {
            Id: 106,
            Name: "DHARMASRAYA",
            provinceId: 6,
         },
         {
            Id: 107,
            Name: "SOLOK SELATAN",
            provinceId: 6,
         },

         // RIAU
         {
            Id: 108,
            Name: "PEKANBARU",
            provinceId: 7,
         },
         {
            Id: 109,
            Name: "PELALAWAN",
            provinceId: 7,
         },
         {
            Id: 110,
            Name: "KAMPAR",
            provinceId: 7,
         },
         {
            Id: 111,
            Name: "ROKAN HULU",
            provinceId: 7,
         },
         {
            Id: 112,
            Name: "SIAK",
            provinceId: 7,
         },
         {
            Id: 113,
            Name: "BENGKALIS",
            provinceId: 7,
         },
         {
            Id: 114,
            Name: "KEPULAUAN MERANTI",
            provinceId: 7,
         },
         {
            Id: 115,
            Name: "DUMAI",
            provinceId: 7,
         },
         {
            Id: 116,
            Name: "ROKAN HILIR",
            provinceId: 7,
         },
         {
            Id: 117,
            Name: "INDRAGIRI HILIR",
            provinceId: 7,
         },
         {
            Id: 118,
            Name: "INDRAGIRI HULU",
            provinceId: 7,
         },
         {
            Id: 119,
            Name: "KUANTAN SINGINGI",
            provinceId: 7,
         },

         // Kepulauan RIAU
         {
            Id: 120,
            Name: "TANJUNG PINANG",
            provinceId: 8,
         },
         {
            Id: 121,
            Name: "BINTAN",
            provinceId: 8,
         },
         {
            Id: 122,
            Name: "BATAM",
            provinceId: 8,
         },
         {
            Id: 123,
            Name: "KARIMUN",
            provinceId: 8,
         },
         {
            Id: 124,
            Name: "NATUNA",
            provinceId: 8,
         },
         {
            Id: 125,
            Name: "KEPULAUAN ANAMBAS",
            provinceId: 8,
         },
         {
            Id: 126,
            Name: "LINGGA",
            provinceId: 8,
         },

         //SUMATERA SELATAN
         {
            Id: 127,
            Name: "PALEMBANG",
            provinceId: 9,
         },
         {
            Id: 128,
            Name: "OGAN KOMERING ILIR",
            provinceId: 9,
         },
         {
            Id: 129,
            Name: "OGAN ILIR",
            provinceId: 9,
         },
         {
            Id: 130,
            Name: "MUSI BANYUASIN",
            provinceId: 9,
         },
         {
            Id: 131,
            Name: "MUSI RAWAS",
            provinceId: 9,
         },
         {
            Id: 132,
            Name: "BANYUASIN",
            provinceId: 9,
         },
         {
            Id: 133,
            Name: "PRABUMULIH",
            provinceId: 9,
         },
         {
            Id: 134,
            Name: "MUARA ENIM",
            provinceId: 9,
         },
         {
            Id: 135,
            Name: "LAHAT",
            provinceId: 9,
         },
         {
            Id: 136,
            Name: "EMPAT LAWANG",
            provinceId: 9,
         },
         {
            Id: 137,
            Name: "PAGAR ALAM",
            provinceId: 9,
         },
         {
            Id: 138,
            Name: "LUBUK LINGGAU",
            provinceId: 9,
         },
         {
            Id: 139,
            Name: "OGAN KOMERING ULU",
            provinceId: 9,
         },
         {
            Id: 140,
            Name: "OGAN KOMERING ULU TIMUR",
            provinceId: 9,
         },
         {
            Id: 141,
            Name: "OGAN KOMERING ULU SELATAN",
            provinceId: 9,
         },

         // BANGKA BELITUNG
         {
            Id: 142,
            Name: "PANGKAL PINANG",
            provinceId: 10,
         },
         {
            Id: 143,
            Name: "BANGKA",
            provinceId: 10,
         },
         {
            Id: 144,
            Name: "BANGKA BARAT",
            provinceId: 10,
         },
         {
            Id: 145,
            Name: "BELITUNG",
            provinceId: 10,
         },
         {
            Id: 146,
            Name: "BELITUNG TIMUR",
            provinceId: 10,
         },
         {
            Id: 147,
            Name: "BANGKA TENGAH",
            provinceId: 10,
         },
         {
            Id: 148,
            Name: "BANGKA SELATAN",
            provinceId: 10,
         },

         //LAMPUNG
         {
            Id: 149,
            Name: "METRO",
            provinceId: 11,
         },
         {
            Id: 150,
            Name: "LAMPUNG TENGAH",
            provinceId: 11,
         },
         {
            Id: 151,
            Name: "LAMPUNG TIMUR",
            provinceId: 11,
         },
         {
            Id: 152,
            Name: "TULANG BAWANG BARAT",
            provinceId: 11,
         },
         {
            Id: 153,
            Name: "LAMPUNG UTARA",
            provinceId: 11,
         },
         {
            Id: 154,
            Name: "TULANG BAWANG",
            provinceId: 11,
         },
         {
            Id: 155,
            Name: "MESUJI",
            provinceId: 11,
         },
         {
            Id: 156,
            Name: "WAY KANAN",
            provinceId: 11,
         },
         {
            Id: 157,
            Name: "LAMPUNG BARAT",
            provinceId: 11,
         },
         {
            Id: 158,
            Name: "PESISIR BARAT",
            provinceId: 11,
         },
         {
            Id: 159,
            Name: "BANDAR LAMPUNG",
            provinceId: 11,
         },
         {
            Id: 160,
            Name: "LAMPUNG SELATAN",
            provinceId: 11,
         },
         {
            Id: 161,
            Name: "PESAWARAN",
            provinceId: 11,
         },
         {
            Id: 162,
            Name: "PRINGSEWU",
            provinceId: 11,
         },
         {
            Id: 163,
            Name: "TANGGAMUS",
            provinceId: 11,
         },

         // JAMBI
         {
            Id: 164,
            Name: "JAMBI",
            provinceId: 12,
         },
         {
            Id: 165,
            Name: "MUARO JAMBI",
            provinceId: 12,
         },
         {
            Id: 166,
            Name: "TANJUNG JABUNG BARAT",
            provinceId: 12,
         },
         {
            Id: 167,
            Name: "TANJUNG JABUNG TIMUR",
            provinceId: 12,
         },
         {
            Id: 168,
            Name: "BATANG HARI",
            provinceId: 12,
         },
         {
            Id: 169,
            Name: "SUNGAIPENUH",
            provinceId: 12,
         },
         {
            Id: 170,
            Name: "KERINCI",
            provinceId: 12,
         },
         {
            Id: 171,
            Name: "BUNGO",
            provinceId: 12,
         },
         {
            Id: 172,
            Name: "TEBO",
            provinceId: 12,
         },
         {
            Id: 173,
            Name: "MERANGIN",
            provinceId: 12,
         },
         {
            Id: 174,
            Name: "SAROLANGUN",
            provinceId: 12,
         },

         //  BENGKULU
         {
            Id: 175,
            Name: "BENGKULU",
            provinceId: 13,
         },
         {
            Id: 176,
            Name: "BENGKULU UTARA",
            provinceId: 13,
         },
         {
            Id: 177,
            Name: "BENGKULU TENGAH",
            provinceId: 13,
         },
         {
            Id: 178,
            Name: "BENGKULU SELATAN",
            provinceId: 13,
         },
         {
            Id: 179,
            Name: "MUKO MUKO",
            provinceId: 13,
         },
         {
            Id: 180,
            Name: "SELUMA",
            provinceId: 13,
         },
         {
            Id: 181,
            Name: "KAUR",
            provinceId: 13,
         },
         {
            Id: 182,
            Name: "REJANG LEBONG",
            provinceId: 13,
         },
         {
            Id: 183,
            Name: "LEBONG",
            provinceId: 13,
         },
         {
            Id: 184,
            Name: "KEPAHIANG",
            provinceId: 13,
         },

         // JAWA TENGAH
         {
            Id: 185,
            Name: "SEMARANG",
            provinceId: 14,
         },
         {
            Id: 186,
            Name: "SALATIGA",
            provinceId: 14,
         },
         {
            Id: 187,
            Name: "PEKALONGAN",
            provinceId: 14,
         },
         {
            Id: 188,
            Name: "BATANG",
            provinceId: 14,
         },
         {
            Id: 189,
            Name: "KENDAL",
            provinceId: 14,
         },
         {
            Id: 190,
            Name: "TEGAL",
            provinceId: 14,
         },
         {
            Id: 191,
            Name: "BREBES",
            provinceId: 14,
         },
         {
            Id: 192,
            Name: "PEMALANG",
            provinceId: 14,
         },
         {
            Id: 193,
            Name: "BANYUMAS",
            provinceId: 14,
         },
         {
            Id: 194,
            Name: "CILACAP",
            provinceId: 14,
         },
         {
            Id: 195,
            Name: "PURBALINGGA",
            provinceId: 14,
         },
         {
            Id: 196,
            Name: "BANJARNEGARA",
            provinceId: 14,
         },
         {
            Id: 197,
            Name: "PURWOREJO",
            provinceId: 14,
         },
         {
            Id: 198,
            Name: "KEBUMEN",
            provinceId: 14,
         },
         {
            Id: 199,
            Name: "MAGELANG",
            provinceId: 14,
         },
         {
            Id: 200,
            Name: "TEMANGGUNG",
            provinceId: 14,
         },
         {
            Id: 201,
            Name: "WONOSOBO",
            provinceId: 14,
         },
         {
            Id: 202,
            Name: "SURAKARTA (SOLO)",
            provinceId: 14,
         },
         {
            Id: 203,
            Name: "SUKOHARJO",
            provinceId: 14,
         },
         {
            Id: 204,
            Name: "KARANGANYAR",
            provinceId: 14,
         },
         {
            Id: 205,
            Name: "SRAGEN",
            provinceId: 14,
         },
         {
            Id: 206,
            Name: "BOYOLALI",
            provinceId: 14,
         },
         {
            Id: 207,
            Name: "KLATEN",
            provinceId: 14,
         },
         {
            Id: 208,
            Name: "WONOGIRI",
            provinceId: 14,
         },
         {
            Id: 209,
            Name: "GROBOGAN",
            provinceId: 14,
         },
         {
            Id: 210,
            Name: "BLORA",
            provinceId: 14,
         },
         {
            Id: 211,
            Name: "PATI",
            provinceId: 14,
         },
         {
            Id: 212,
            Name: "REMBANG",
            provinceId: 14,
         },
         {
            Id: 213,
            Name: "KUDUS",
            provinceId: 14,
         },
         {
            Id: 214,
            Name: "JEPARA",
            provinceId: 14,
         },
         {
            Id: 215,
            Name: "DEMAK",
            provinceId: 14,
         },

         // Yogyakarta
         {
            Id: 216,
            Name: "YOGYAKARTA",
            provinceId: 15,
         },
         {
            Id: 217,
            Name: "BANTUL",
            provinceId: 15,
         },
         {
            Id: 218,
            Name: "SLEMAN",
            provinceId: 15,
         },
         {
            Id: 219,
            Name: "KULON PROGO",
            provinceId: 15,
         },
         {
            Id: 220,
            Name: "GUNUNG KIDUL",
            provinceId: 15,
         },

         // JAWA TIMUR
         {
            Id: 221,
            Name: "SURABAYA",
            provinceId: 16,
         },
         {
            Id: 222,
            Name: "GRESIK",
            provinceId: 16,
         },
         {
            Id: 223,
            Name: "SIDOARJO",
            provinceId: 16,
         },
         {
            Id: 224,
            Name: "MOJOKERTO",
            provinceId: 16,
         },
         {
            Id: 225,
            Name: "JOMBANG",
            provinceId: 16,
         },
         {
            Id: 226,
            Name: "BOJONEGORO",
            provinceId: 16,
         },
         {
            Id: 227,
            Name: "LAMONGAN",
            provinceId: 16,
         },
         {
            Id: 228,
            Name: "TUBAN",
            provinceId: 16,
         },
         {
            Id: 229,
            Name: "MADIUN",
            provinceId: 16,
         },
         {
            Id: 230,
            Name: "MAGETAN",
            provinceId: 16,
         },
         {
            Id: 231,
            Name: "NGAWI",
            provinceId: 16,
         },
         {
            Id: 232,
            Name: "PONOROGO",
            provinceId: 16,
         },
         {
            Id: 233,
            Name: "PACITAN",
            provinceId: 16,
         },
         {
            Id: 234,
            Name: "KEDIRI",
            provinceId: 16,
         },
         {
            Id: 235,
            Name: "NGANJUK",
            provinceId: 16,
         },
         {
            Id: 236,
            Name: "MALANG",
            provinceId: 16,
         },
         {
            Id: 237,
            Name: "BATU",
            provinceId: 16,
         },
         {
            Id: 238,
            Name: "BLITAR",
            provinceId: 16,
         },
         {
            Id: 239,
            Name: "TULUNGAGUNG",
            provinceId: 16,
         },
         {
            Id: 240,
            Name: "TRENGGALEK",
            provinceId: 16,
         },
         {
            Id: 241,
            Name: "PASURUAN",
            provinceId: 16,
         },
         {
            Id: 242,
            Name: "PROBOLINGGO",
            provinceId: 16,
         },
         {
            Id: 243,
            Name: "LUMAJANG",
            provinceId: 16,
         },
         {
            Id: 244,
            Name: "JEMBER",
            provinceId: 16,
         },
         {
            Id: 245,
            Name: "BONDOWOSO",
            provinceId: 16,
         },
         {
            Id: 246,
            Name: "SITUBONDO",
            provinceId: 16,
         },
         {
            Id: 247,
            Name: "BANYUWANGI",
            provinceId: 16,
         },
         {
            Id: 248,
            Name: "BANGKALAN",
            provinceId: 16,
         },
         {
            Id: 249,
            Name: "SAMPANG",
            provinceId: 16,
         },
         {
            Id: 250,
            Name: "PAMEKASAN",
            provinceId: 16,
         },
         {
            Id: 251,
            Name: "SUMENEP",
            provinceId: 16,
         },

         // KALIMANTAN SELATAN
         {
            Id: 252,
            Name: "BANJARMASIN",
            provinceId: 17,
         },
         {
            Id: 253,
            Name: "BARITO KUALA",
            provinceId: 17,
         },
         {
            Id: 254,
            Name: "BANJAR",
            provinceId: 17,
         },
         {
            Id: 255,
            Name: "BANJARBARU",
            provinceId: 17,
         },
         {
            Id: 256,
            Name: "TANAH LAUT",
            provinceId: 17,
         },
         {
            Id: 257,
            Name: "TAPIN",
            provinceId: 17,
         },
         {
            Id: 258,
            Name: "HULU SUNGAI SELATAN",
            provinceId: 17,
         },
         {
            Id: 259,
            Name: "HULU SUNGAI TENGAH",
            provinceId: 17,
         },
         {
            Id: 260,
            Name: "HULU SUNGAI UTARA",
            provinceId: 17,
         },
         {
            Id: 261,
            Name: "TABALONG",
            provinceId: 17,
         },
         {
            Id: 262,
            Name: "BALANGAN",
            provinceId: 17,
         },
         {
            Id: 263,
            Name: "KOTABARU",
            provinceId: 17,
         },
         {
            Id: 264,
            Name: "TANAH BUMBU",
            provinceId: 17,
         },

         // KALIMANTAN TENGAH
         {
            Id: 265,
            Name: "PALANGKA RAYA",
            provinceId: 18,
         },
         {
            Id: 266,
            Name: "KAPUAS",
            provinceId: 18,
         },
         {
            Id: 267,
            Name: "BARITO TIMUR",
            provinceId: 18,
         },
         {
            Id: 268,
            Name: "BARITO SELATAN",
            provinceId: 18,
         },
         {
            Id: 269,
            Name: "BARITO UTARA",
            provinceId: 18,
         },
         {
            Id: 270,
            Name: "MURUNG RAYA",
            provinceId: 18,
         },
         {
            Id: 271,
            Name: "KOTAWARINGIN BARAT",
            provinceId: 18,
         },
         {
            Id: 272,
            Name: "LAMANDAU",
            provinceId: 18,
         },
         {
            Id: 273,
            Name: "SUKAMARA",
            provinceId: 18,
         },
         {
            Id: 274,
            Name: "SERUYAN",
            provinceId: 18,
         },
         {
            Id: 275,
            Name: "KOTAWARINGIN TIMUR",
            provinceId: 18,
         },
         {
            Id: 276,
            Name: "KATINGAN",
            provinceId: 18,
         },
         {
            Id: 277,
            Name: "GUNUNG MAS",
            provinceId: 18,
         },
         {
            Id: 278,
            Name: "PULANG PISAU",
            provinceId: 18,
         },

         // KALIMANTAN TIMUR
         {
            Id: 279,
            Name: "SAMARINDA",
            provinceId: 19,
         },
         {
            Id: 280,
            Name: "KUTAI KARTANEGARA",
            provinceId: 19,
         },
         {
            Id: 281,
            Name: "BONTANG",
            provinceId: 19,
         },
         {
            Id: 282,
            Name: "KUTAI TIMUR",
            provinceId: 19,
         },
         {
            Id: 283,
            Name: "KUTAI BARAT",
            provinceId: 19,
         },
         {
            Id: 284,
            Name: "BALIKPAPAN",
            provinceId: 19,
         },
         {
            Id: 285,
            Name: "PENAJAM PASER UTARA",
            provinceId: 19,
         },
         {
            Id: 286,
            Name: "PASER",
            provinceId: 19,
         },
         {
            Id: 287,
            Name: "BERAU",
            provinceId: 19,
         },

         // KALIMANTAN UTARA
         {
            Id: 288,
            Name: "TARAKAN",
            provinceId: 20,
         },
         {
            Id: 289,
            Name: "TANA TIDUNG",
            provinceId: 20,
         },
         {
            Id: 290,
            Name: "MALINAU",
            provinceId: 20,
         },
         {
            Id: 291,
            Name: "BULUNGAN (BULONGAN)",
            provinceId: 20,
         },
         {
            Id: 292,
            Name: "NUNUKAN",
            provinceId: 20,
         },

         // KALIMANTAN BARAT
         {
            Id: 293,
            Name: "PONTIANAK",
            provinceId: 21,
         },
         {
            Id: 294,
            Name: "KUBU RAYA",
            provinceId: 21,
         },
         {
            Id: 295,
            Name: "SANGGAU",
            provinceId: 21,
         },
         {
            Id: 296,
            Name: "SINTANG",
            provinceId: 21,
         },
         {
            Id: 297,
            Name: "KAPUAS HULU",
            provinceId: 21,
         },
         {
            Id: 298,
            Name: "KETAPANG",
            provinceId: 21,
         },
         {
            Id: 299,
            Name: "KAYONG UTARA",
            provinceId: 21,
         },
         {
            Id: 300,
            Name: "SINGKAWANG",
            provinceId: 21,
         },
         {
            Id: 301,
            Name: "SAMBAS",
            provinceId: 21,
         },
         {
            Id: 302,
            Name: "BENGKAYANG",
            provinceId: 21,
         },
         {
            Id: 303,
            Name: "LANDAK",
            provinceId: 21,
         },
         {
            Id: 304,
            Name: "SEKADAU",
            provinceId: 21,
         },
         {
            Id: 305,
            Name: "MELAWI",
            provinceId: 21,
         },

         // BALI
         {
            Id: 306,
            Name: "DENPASAR",
            provinceId: 22,
         },
         {
            Id: 307,
            Name: "BADUNG",
            provinceId: 22,
         },
         {
            Id: 308,
            Name: "GIANYAR",
            provinceId: 22,
         },
         {
            Id: 309,
            Name: "BANGLI",
            provinceId: 22,
         },
         {
            Id: 310,
            Name: "KLUNGKUNG",
            provinceId: 22,
         },
         {
            Id: 311,
            Name: "KARANGASEM",
            provinceId: 22,
         },
         {
            Id: 312,
            Name: "BULELENG",
            provinceId: 22,
         },
         {
            Id: 313,
            Name: "TABANAN",
            provinceId: 22,
         },
         {
            Id: 314,
            Name: "JEMBRANA",
            provinceId: 22,
         },

         // NUSA TENGGARA BARAT
         {
            Id: 315,
            Name: "MATARAM",
            provinceId: 23,
         },
         {
            Id: 316,
            Name: "LOMBOK BARAT",
            provinceId: 23,
         },
         {
            Id: 317,
            Name: "LOMBOK UTARA",
            provinceId: 23,
         },
         {
            Id: 318,
            Name: "LOMBOK TENGAH",
            provinceId: 23,
         },
         {
            Id: 319,
            Name: "LOMBOK TIMUR",
            provinceId: 23,
         },
         {
            Id: 320,
            Name: "BIMA",
            provinceId: 23,
         },
         {
            Id: 321,
            Name: "DOMPU",
            provinceId: 23,
         },
         {
            Id: 322,
            Name: "SUMBAWA",
            provinceId: 23,
         },
         {
            Id: 323,
            Name: "SUMBAWA BARAT",
            provinceId: 23,
         },

         // NUSA TENGGARA TIMUR
         {
            Id: 324,
            Name: "KUPANG",
            provinceId: 24,
         },
         {
            Id: 325,
            Name: "SABU RAIJUA",
            provinceId: 24,
         },
         {
            Id: 326,
            Name: "TIMOR TENGAH SELATAN",
            provinceId: 24,
         },
         {
            Id: 327,
            Name: "TIMOR TENGAH UTARA",
            provinceId: 24,
         },
         {
            Id: 328,
            Name: "BELU",
            provinceId: 24,
         },
         {
            Id: 329,
            Name: "ALOR",
            provinceId: 24,
         },
         {
            Id: 330,
            Name: "ROTE NDAO",
            provinceId: 24,
         },
         {
            Id: 331,
            Name: "SIKKA",
            provinceId: 24,
         },
         {
            Id: 332,
            Name: "ENDE",
            provinceId: 24,
         },
         {
            Id: 333,
            Name: "FLORES TIMUR",
            provinceId: 24,
         },
         {
            Id: 334,
            Name: "NGADA",
            provinceId: 24,
         },
         {
            Id: 335,
            Name: "NAGEKEO",
            provinceId: 24,
         },
         {
            Id: 336,
            Name: "MANGGARAI",
            provinceId: 24,
         },
         {
            Id: 337,
            Name: "MANGGARAI TIMUR",
            provinceId: 24,
         },
         {
            Id: 338,
            Name: "LEMBATA",
            provinceId: 24,
         },
         {
            Id: 339,
            Name: "MANGGARAI BARAT",
            provinceId: 24,
         },
         {
            Id: 340,
            Name: "SUMBA TIMUR",
            provinceId: 24,
         },
         {
            Id: 341,
            Name: "SUMBA BARAT",
            provinceId: 24,
         },
         {
            Id: 342,
            Name: "SUMBA BARAT DAYA",
            provinceId: 24,
         },
         {
            Id: 343,
            Name: "SUMBA TENGAH",
            provinceId: 24,
         },

         // SULAWESI SELATAN
         {
            Id: 344,
            Name: "MAKASSAR",
            provinceId: 25,
         },
         {
            Id: 345,
            Name: "GOWA",
            provinceId: 25,
         },
         {
            Id: 346,
            Name: "BONE",
            provinceId: 25,
         },
         {
            Id: 347,
            Name: "MAROS",
            provinceId: 25,
         },
         {
            Id: 348,
            Name: "PANGKAJENE KEPULAUAN",
            provinceId: 25,
         },
         {
            Id: 349,
            Name: "BARRU",
            provinceId: 25,
         },
         {
            Id: 350,
            Name: "SOPPENG",
            provinceId: 25,
         },
         {
            Id: 351,
            Name: "WAJO",
            provinceId: 25,
         },
         {
            Id: 352,
            Name: "PAREPARE",
            provinceId: 25,
         },
         {
            Id: 353,
            Name: "PINRANG",
            provinceId: 25,
         },
         {
            Id: 354,
            Name: "SIDENRENG RAPPANG/RAPANG",
            provinceId: 25,
         },
         {
            Id: 355,
            Name: "SINJAI",
            provinceId: 25,
         },
         {
            Id: 356,
            Name: "ENREKANG",
            provinceId: 25,
         },
         {
            Id: 357,
            Name: "TANA TORAJA",
            provinceId: 25,
         },
         {
            Id: 358,
            Name: "TORAJA UTARA",
            provinceId: 25,
         },
         {
            Id: 359,
            Name: "LUWU UTARA",
            provinceId: 25,
         },
         {
            Id: 360,
            Name: "PALOPO",
            provinceId: 25,
         },
         {
            Id: 361,
            Name: "LUWU",
            provinceId: 25,
         },
         {
            Id: 362,
            Name: "LUWU TIMUR",
            provinceId: 25,
         },
         {
            Id: 363,
            Name: "TAKALAR",
            provinceId: 25,
         },
         {
            Id: 364,
            Name: "JENEPONTO",
            provinceId: 25,
         },
         {
            Id: 365,
            Name: "BANTAENG",
            provinceId: 25,
         },
         {
            Id: 366,
            Name: "BULUKUMBA",
            provinceId: 25,
         },
         {
            Id: 367,
            Name: "SELAYAR (KEPULAUAN SELAYAR)",
            provinceId: 25,
         },

         // SULAWESI BARAT
         {
            Id: 368,
            Name: "POLEWALI MANDAR",
            provinceId: 26,
         },
         {
            Id: 369,
            Name: "MAMUJU",
            provinceId: 26,
         },
         {
            Id: 370,
            Name: "MAMASA",
            provinceId: 26,
         },
         {
            Id: 371,
            Name: "MAJENE",
            provinceId: 26,
         },
         {
            Id: 372,
            Name: "MAMUJU UTARA",
            provinceId: 26,
         },

         // SULAWESI TENGGARA
         {
            Id: 373,
            Name: "KENDARI",
            provinceId: 27,
         },
         {
            Id: 374,
            Name: "KONAWE",
            provinceId: 27,
         },
         {
            Id: 375,
            Name: "KONAWE UTARA",
            provinceId: 27,
         },
         {
            Id: 376,
            Name: "KONAWE SELATAN",
            provinceId: 27,
         },
         {
            Id: 377,
            Name: "KOLAKA",
            provinceId: 27,
         },
         {
            Id: 378,
            Name: "MUNA",
            provinceId: 27,
         },
         {
            Id: 379,
            Name: "BUTON UTARA",
            provinceId: 27,
         },
         {
            Id: 380,
            Name: "BAU-BAU",
            provinceId: 27,
         },
         {
            Id: 381,
            Name: "BUTON",
            provinceId: 27,
         },
         {
            Id: 382,
            Name: "BOMBANA",
            provinceId: 27,
         },
         {
            Id: 383,
            Name: "WAKATOBI",
            provinceId: 27,
         },
         {
            Id: 384,
            Name: "KOLAKA UTARA",
            provinceId: 27,
         },

         // SULAWESI TENGAH
         {
            Id: 385,
            Name: "PALU",
            provinceId: 28,
         },
         {
            Id: 386,
            Name: "SIGI",
            provinceId: 28,
         },
         {
            Id: 387,
            Name: "DONGGALA",
            provinceId: 28,
         },
         {
            Id: 388,
            Name: "PARIGI MOUTONG",
            provinceId: 28,
         },
         {
            Id: 389,
            Name: "TOLI-TOLI",
            provinceId: 28,
         },
         {
            Id: 390,
            Name: "BUOL",
            provinceId: 28,
         },
         {
            Id: 391,
            Name: "POSO",
            provinceId: 28,
         },
         {
            Id: 392,
            Name: "TOJO UNA-UNA",
            provinceId: 28,
         },
         {
            Id: 393,
            Name: "BANGGAI",
            provinceId: 28,
         },
         {
            Id: 394,
            Name: "BANGGAI KEPULAUAN",
            provinceId: 28,
         },
         {
            Id: 395,
            Name: "MOROWALI",
            provinceId: 28,
         },

         // SULAWESI UTARA
         {
            Id: 396,
            Name: "MANADO",
            provinceId: 29,
         },
         {
            Id: 397,
            Name: "MINAHASA SELATAN",
            provinceId: 29,
         },
         {
            Id: 398,
            Name: "MINAHASA UTARA",
            provinceId: 29,
         },
         {
            Id: 399,
            Name: "MINAHASA",
            provinceId: 29,
         },
         {
            Id: 400,
            Name: "TOMOHON",
            provinceId: 29,
         },
         {
            Id: 401,
            Name: "BITUNG",
            provinceId: 29,
         },
         {
            Id: 402,
            Name: "KOTAMOBAGU",
            provinceId: 29,
         },
         {
            Id: 403,
            Name: "BOLAANG MONGONDOW (BOLMONG)",
            provinceId: 29,
         },
         {
            Id: 404,
            Name: "BOLAANG MONGONDOW UTARA",
            provinceId: 29,
         },
         {
            Id: 405,
            Name: "BOLAANG MONGONDOW SELATAN",
            provinceId: 29,
         },
         {
            Id: 406,
            Name: "BOLAANG MONGONDOW TIMUR",
            provinceId: 29,
         },
         {
            Id: 407,
            Name: "KEPULAUAN SANGIHE",
            provinceId: 29,
         },
         {
            Id: 408,
            Name: "KEPULAUAN SIAU TAGULANDANG BIARO (SITARO)",
            provinceId: 29,
         },
         {
            Id: 409,
            Name: "KEPULAUAN TALAUD",
            provinceId: 29,
         },
         {
            Id: 410,
            Name: "MINAHASA TENGGARA",
            provinceId: 29,
         },

         // GORONTALO
         {
            Id: 411,
            Name: "GORONTALO",
            provinceId: 30,
         },
         {
            Id: 412,
            Name: "GORONTALO UTARA",
            provinceId: 30,
         },
         {
            Id: 413,
            Name: "BOALEMO",
            provinceId: 30,
         },
         {
            Id: 414,
            Name: "POHUWATO",
            provinceId: 30,
         },
         {
            Id: 415,
            Name: "BONE BOLANGO",
            provinceId: 30,
         },

         // MALUKU
         {
            Id: 416,
            Name: "AMBON",
            provinceId: 31,
         },
         {
            Id: 417,
            Name: "MALUKU BARAT DAYA",
            provinceId: 31,
         },
         {
            Id: 418,
            Name: "MALUKU TENGGARA BARAT",
            provinceId: 31,
         },
         {
            Id: 419,
            Name: "MALUKU TENGAH",
            provinceId: 31,
         },
         {
            Id: 420,
            Name: "BURU SELATAN",
            provinceId: 31,
         },
         {
            Id: 421,
            Name: "SERAM BAGIAN TIMUR",
            provinceId: 31,
         },
         {
            Id: 422,
            Name: "SERAM BAGIAN BARAT",
            provinceId: 31,
         },
         {
            Id: 423,
            Name: "BURU",
            provinceId: 31,
         },
         {
            Id: 424,
            Name: "MALUKU TENGGARA",
            provinceId: 31,
         },
         {
            Id: 425,
            Name: "TUAL",
            provinceId: 31,
         },
         {
            Id: 426,
            Name: "KEPULAUAN ARU",
            provinceId: 31,
         },

         // MALUKU UTARA
         {
            Id: 427,
            Name: "TERNATE",
            provinceId: 32,
         },
         {
            Id: 428,
            Name: "HALMAHERA BARAT",
            provinceId: 32,
         },
         {
            Id: 429,
            Name: "HALMAHERA UTARA",
            provinceId: 32,
         },
         {
            Id: 430,
            Name: "HALMAHERA SELATAN",
            provinceId: 32,
         },
         {
            Id: 431,
            Name: "PULAU MOROTAI",
            provinceId: 32,
         },
         {
            Id: 432,
            Name: "KEPULAUAN SULA",
            provinceId: 32,
         },
         {
            Id: 433,
            Name: "TIDORE KEPULAUAN",
            provinceId: 32,
         },
         {
            Id: 434,
            Name: "HALMAHERA TENGAH",
            provinceId: 32,
         },
         {
            Id: 435,
            Name: "HALMAHERA TIMUR",
            provinceId: 32,
         },

         // PAPUA
         {
            Id: 436,
            Name: "BIAK NUMFOR",
            provinceId: 33,
         },
         {
            Id: 437,
            Name: "SUPIORI",
            provinceId: 33,
         },
         {
            Id: 438,
            Name: "KEPULAUAN YAPEN (YAPEN WAROPEN)",
            provinceId: 33,
         },
         {
            Id: 439,
            Name: "WAROPEN",
            provinceId: 33,
         },
         {
            Id: 440,
            Name: "MAMBERAMO RAYA",
            provinceId: 33,
         },
         {
            Id: 441,
            Name: "PANIAI",
            provinceId: 33,
         },
         {
            Id: 442,
            Name: "DEIYAI (DELIYAI)",
            provinceId: 33,
         },
         {
            Id: 443,
            Name: "INTAN JAYA",
            provinceId: 33,
         },
         {
            Id: 444,
            Name: "NABIRE",
            provinceId: 33,
         },
         {
            Id: 445,
            Name: "DOGIYAI",
            provinceId: 33,
         },
         {
            Id: 446,
            Name: "PUNCAK JAYA",
            provinceId: 33,
         },
         {
            Id: 447,
            Name: "PUNCAK",
            provinceId: 33,
         },
         {
            Id: 448,
            Name: "JAYAPURA",
            provinceId: 33,
         },
         {
            Id: 449,
            Name: "SARMI",
            provinceId: 33,
         },
         {
            Id: 450,
            Name: "KEEROM",
            provinceId: 33,
         },
         {
            Id: 451,
            Name: "JAYAWIJAYA",
            provinceId: 33,
         },
         {
            Id: 452,
            Name: "MAMBERAMO TENGAH",
            provinceId: 33,
         },
         {
            Id: 453,
            Name: "LANNY JAYA",
            provinceId: 33,
         },
         {
            Id: 454,
            Name: "TOLIKARA",
            provinceId: 33,
         },
         {
            Id: 455,
            Name: "NDUGA",
            provinceId: 33,
         },
         {
            Id: 456,
            Name: "YAHUKIMO",
            provinceId: 33,
         },
         {
            Id: 457,
            Name: "PEGUNUNGAN BINTANG",
            provinceId: 33,
         },
         {
            Id: 458,
            Name: "YALIMO",
            provinceId: 33,
         },
         {
            Id: 459,
            Name: "MERAUKE",
            provinceId: 33,
         },
         {
            Id: 460,
            Name: "BOVEN DIGOEL",
            provinceId: 33,
         },
         {
            Id: 461,
            Name: "ASMAT",
            provinceId: 33,
         },
         {
            Id: 462,
            Name: "MAPPI",
            provinceId: 33,
         },
         {
            Id: 463,
            Name: "MIMIKA",
            provinceId: 33,
         },

         // PAPUA BARAT
         {
            Id: 464,
            Name: "MANOKWARI",
            provinceId: 34,
         },
         {
            Id: 465,
            Name: "PEGUNUNGAN ARFAK",
            provinceId: 34,
         },
         {
            Id: 466,
            Name: "MANOKWARI SELATAN",
            provinceId: 34,
         },
         {
            Id: 467,
            Name: "TELUK WONDAMA",
            provinceId: 34,
         },
         {
            Id: 468,
            Name: "TELUK BINTUNI",
            provinceId: 34,
         },
         {
            Id: 469,
            Name: "TAMBRAUW",
            provinceId: 34,
         },
         {
            Id: 470,
            Name: "SORONG",
            provinceId: 34,
         },
         {
            Id: 471,
            Name: "SORONG SELATAN",
            provinceId: 34,
         },
         {
            Id: 472,
            Name: "MAYBRAT",
            provinceId: 34,
         },
         {
            Id: 473,
            Name: "RAJA AMPAT",
            provinceId: 34,
         },
         {
            Id: 474,
            Name: "FAKFAK",
            provinceId: 34,
         },
         {
            Id: 475,
            Name: "KAIMANA",
            provinceId: 34,
         },
      ];

      return cities.filter(
         (data) => !provinceId || data.provinceId == provinceId
      );
   },
};

const getters = {
   user: (state) => state.user,
};

export default {
   namespaced: true,
   state,
   mutations,
   actions,
   getters,
};
