// --- Các hàm phong thủy (giữ nguyên) ---
function parseDateParts(dateStr){
  if(!dateStr || typeof dateStr!=='string') throw new Error('Ngày sinh không hợp lệ');
  const s = dateStr.trim();
  const sep = s.includes('-') ? '-' : (s.includes('/') ? '/' : null);
  if(!sep) throw new Error('Định dạng ngày phải có "-" hoặc "/" (vd 1992-03-13 hoặc 26/05/1992)');
  const parts = s.split(sep).map(x=>parseInt(x,10));
  if(parts.length!==3 || parts.some(isNaN)) throw new Error('Định dạng ngày không đúng');
  if(parts[0] > 31) return {year:parts[0], month:parts[1], day:parts[2]};
  return {year:parts[2], month:parts[1], day:parts[0]};
}
function getEffectiveBirthYear(birthDateString){
  const {year,month,day} = parseDateParts(birthDateString);
  if(month < 3 || (month===3 && day<=13)) return year - 1;
  return year;
}
function digitalRoot(year){
  let sum = String(year).split('').reduce((a,b)=>a+Number(b),0);
  while(sum > 9) sum = String(sum).split('').reduce((a,b)=>a+Number(b),0);
  return sum;
}

const CUNG_INFO = {
  'Càn':  { nguyenTo:'Kim',  huong:'Tây Bắc' },
  'Khôn': { nguyenTo:'Thổ',  huong:'Tây Nam' },
  'Cấn':  { nguyenTo:'Thổ',  huong:'Đông Bắc' },
  'Chấn': { nguyenTo:'Mộc',  huong:'Đông' },
  'Tốn':  { nguyenTo:'Mộc',  huong:'Đông Nam' },
  'Ly':   { nguyenTo:'Hỏa',  huong:'Nam' },
  'Khảm': { nguyenTo:'Thủy', huong:'Bắc' },
  'Đoài': { nguyenTo:'Kim',  huong:'Tây' }
};
const DONG_TU = ['Khảm','Ly','Chấn','Tốn'];
const MALE_START = 1921, FEMALE_START = 1922;
const MALE_CUNG_SEQ = ['Đoài','Càn','Khôn','Tốn','Chấn','Khôn','Khảm','Ly','Cấn'];
const FEMALE_CUNG_SEQ = ['Cấn','Khảm','Ly','Tốn','Chấn','Khôn','Càn','Đoài','Cấn'];
const mod9 = n => ((n%9)+9)%9;
function getCungMenh(birthDateString, gender){
  const effectiveYear = getEffectiveBirthYear(birthDateString);
  let idx,cung;
  if(gender==='nam'){
    idx = mod9(effectiveYear - MALE_START);
    cung = MALE_CUNG_SEQ[idx];
  }else{
    idx = mod9(effectiveYear - FEMALE_START);
    cung = FEMALE_CUNG_SEQ[idx];
  }
  const {nguyenTo, huong} = CUNG_INFO[cung];
  const nhomTrach = DONG_TU.includes(cung) ? 'Đông Tứ Trạch' : 'Tây Tứ Trạch';
  return { effectiveYear, cung, nhomTrach, nguyenTo, huong };
}
function getBatTrachForCung(cung){
  const C = {
    good:{
      'Sinh Khí':{ten:'Sinh Khí',loai:'good',y:'Tài lộc, danh tiếng, thăng tiến, vượng khí.'},
      'Thiên Y': {ten:'Thiên Y', loai:'good',y:'Sức khỏe, trường thọ, quý nhân.'},
      'Diên Niên':{ten:'Diên Niên',loai:'good',y:'Hòa thuận, bền vững quan hệ.'},
      'Phục Vị': {ten:'Phục Vị', loai:'good',y:'Ổn định, thi cử, phát triển bản thân.'}
    },
    bad:{
      'Tuyệt Mệnh':{ten:'Tuyệt Mệnh',loai:'bad',y:'Nặng nhất: tổn hại lớn, bệnh tật, phá sản.'},
      'Ngũ Quỷ':   {ten:'Ngũ Quỷ',   loai:'bad',y:'Thị phi, mất mát, tranh cãi.'},
      'Lục Sát':   {ten:'Lục Sát',   loai:'bad',y:'Kiện tụng, tai nạn, bất hòa.'},
      'Họa Hại':   {ten:'Họa Hại',   loai:'bad',y:'Xui xẻo, thất bại nhỏ lẻ.'}
    }
  };
  const B = {
    'Khảm': {'Đông Nam':C.good['Sinh Khí'],'Đông':C.good['Thiên Y'],'Nam':C.good['Diên Niên'],'Bắc':C.good['Phục Vị'],'Tây Nam':C.bad['Tuyệt Mệnh'],'Đông Bắc':C.bad['Ngũ Quỷ'],'Tây Bắc':C.bad['Lục Sát'],'Tây':C.bad['Họa Hại']},
    'Ly':   {'Đông':C.good['Sinh Khí'],'Đông Nam':C.good['Thiên Y'],'Bắc':C.good['Diên Niên'],'Nam':C.good['Phục Vị'],'Tây Bắc':C.bad['Tuyệt Mệnh'],'Tây':C.bad['Ngũ Quỷ'],'Tây Nam':C.bad['Lục Sát'],'Đông Bắc':C.bad['Họa Hại']},
    'Chấn': {'Nam':C.good['Sinh Khí'],'Bắc':C.good['Thiên Y'],'Đông Nam':C.good['Diên Niên'],'Đông':C.good['Phục Vị'],'Tây':C.bad['Tuyệt Mệnh'],'Tây Bắc':C.bad['Ngũ Quỷ'],'Đông Bắc':C.bad['Lục Sát'],'Tây Nam':C.bad['Họa Hại']},
    'Tốn':  {'Bắc':C.good['Sinh Khí'],'Nam':C.good['Thiên Y'],'Đông':C.good['Diên Niên'],'Đông Nam':C.good['Phục Vị'],'Đông Bắc':C.bad['Tuyệt Mệnh'],'Tây Nam':C.bad['Ngũ Quỷ'],'Tây':C.bad['Lục Sát'],'Tây Bắc':C.bad['Họa Hại']},
    'Càn':  {'Tây':C.good['Sinh Khí'],'Đông Bắc':C.good['Thiên Y'],'Tây Nam':C.good['Diên Niên'],'Tây Bắc':C.good['Phục Vị'],'Nam':C.bad['Tuyệt Mệnh'],'Đông':C.bad['Ngũ Quỷ'],'Bắc':C.bad['Lục Sát'],'Đông Nam':C.bad['Họa Hại']},
    'Khôn': {'Đông Bắc':C.good['Sinh Khí'],'Tây':C.good['Thiên Y'],'Tây Bắc':C.good['Diên Niên'],'Tây Nam':C.good['Phục Vị'],'Bắc':C.bad['Tuyệt Mệnh'],'Đông Nam':C.bad['Ngũ Quỷ'],'Nam':C.bad['Lục Sát'],'Đông':C.bad['Họa Hại']},
    'Cấn':  {'Tây Nam':C.good['Sinh Khí'],'Tây Bắc':C.good['Thiên Y'],'Tây':C.good['Diên Niên'],'Đông Bắc':C.good['Phục Vị'],'Đông Nam':C.bad['Tuyệt Mệnh'],'Bắc':C.bad['Ngũ Quỷ'],'Đông':C.bad['Lục Sát'],'Nam':C.bad['Họa Hại']},
    'Đoài': {'Tây Bắc':C.good['Sinh Khí'],'Tây Nam':C.good['Thiên Y'],'Đông Bắc':C.good['Diên Niên'],'Tây':C.good['Phục Vị'],'Đông':C.bad['Tuyệt Mệnh'],'Nam':C.bad['Ngũ Quỷ'],'Đông Nam':C.bad['Lục Sát'],'Bắc':C.bad['Họa Hại']}
  };
  return B[cung];
}
function analyzeHouseDirection(cungObj, huongNha){
  const table = getBatTrachForCung(cungObj.cung);
  const all = Object.entries(table).map(([huong,info])=>({huong, ...info}));
  const selected = table[huongNha];
  const goods = all.filter(x=>x.loai==='good');
  const bads  = all.filter(x=>x.loai==='bad');
  return {selected, goods, bads, all};
}
function adviceForDirectionClass(cls){
  if(!cls) return [];
  if(cls==='good') return [
    'Ưu tiên cửa chính/ban công theo hướng này.',
    'Bếp, bàn thờ, giường, bàn làm việc xoay về 1 trong 4 hướng tốt.',
    'Giữ lối vào thông thoáng, sạch sẽ.'
  ];
  return [
    'Dùng bình phong/hiên/bậc tam cấp để “bẻ dòng khí xấu”.',
    'Bố trí nội thất “tọa hung – hướng cát”.',
    'Treo Bát Quái lồi ngoài cổng (cân nhắc).',
    'Tăng cây xanh, ánh sáng, nước/đá trang trí để điều hòa khí.'
  ];
}

// --- 12 con giáp & các kiểm tra năm/tháng xây ---
const ZODIAC = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
function idxZodiac(y){ return ((y-4)%12+12)%12; }
function nameZodiac(y){ return ZODIAC[idxZodiac(y)]; }
function nameByIndex(i){ return ZODIAC[i]; }
const TAM_TAI_GROUPS = [
  {group:['Thân','Tý','Thìn'], tamTai:['Dần','Mão','Thìn']},
  {group:['Dần','Ngọ','Tuất'], tamTai:['Thân','Dậu','Tuất']},
  {group:['Hợi','Mão','Mùi'], tamTai:['Tỵ','Ngọ','Mùi']},
  {group:['Tỵ','Dậu','Sửu'], tamTai:['Hợi','Tý','Sửu']}
];
function checkTamTai(ownerYear, constructionYear){
  const ownerChi = nameZodiac(ownerYear);
  const cChi = nameZodiac(constructionYear);
  const g = TAM_TAI_GROUPS.find(x=>x.group.includes(ownerChi));
  return {isTamTai: g ? g.tamTai.includes(cChi) : false, ownerChi, constructionChi:cChi, tamTaiList:g?g.tamTai:[]};
}
function tuoiMu(effYear, consYear){ return consYear - effYear + 1; }
function checkKimLau(tuoi){
  let r = tuoi%9; if(r===0) r=9;
  const types = {1:'Kim Lâu Thân',3:'Kim Lâu Thê',6:'Kim Lâu Tử',8:'Kim Lâu Lục Súc'};
  return {isKimLau:[1,3,6,8].includes(r), type:types[r]||null, remainder:r};
}
function checkHoangOc(tuoi){
  const labels = ['Nhất Cát','Nhì Nghi','Tam Địa Sát','Tứ Tấn Tài','Ngũ Thọ Tử','Lục Hoang Ốc'];
  const m = tuoi%6; const idx = (m===0)?5:m-1; const name = labels[idx];
  return {name, isBad:['Tam Địa Sát','Ngũ Thọ Tử','Lục Hoang Ốc'].includes(name)};
}
function checkXungTuoi(ownerYear, consYear){
  const opp = (idxZodiac(ownerYear)+6)%12;
  return {isXung: idxZodiac(consYear)===opp, ownerYear, consYear, oppositeChi:nameByIndex(opp), ownerChi:nameZodiac(ownerYear), constructionChi:nameZodiac(consYear)};
}
function elementYear(y){
  const s = ((y-4)%10+10)%10;
  if(s===0||s===1) return 'Mộc';
  if(s===2||s===3) return 'Hỏa';
  if(s===4||s===5) return 'Thổ';
  if(s===6||s===7) return 'Kim';
  return 'Thủy';
}
function elementMonth(month){
  month = Number(month);
  if([1,6,11].includes(month)) return 'Thủy';
  if([2,7,12].includes(month)) return 'Hỏa';
  if([3,8].includes(month)) return 'Thổ';
  if([4,9].includes(month)) return 'Kim';
  if([5,10].includes(month)) return 'Mộc';
  return null;
}
const KHAC = {'Mộc':'Thổ','Thổ':'Thủy','Thủy':'Hỏa','Hỏa':'Kim','Kim':'Mộc'};
function isElementConflict(e1,e2){
  if(!e1 || !e2) return false;
  return (KHAC[e1]===e2) || (KHAC[e2]===e1);
}

// --- Yếu tố xấu BĐS & hóa giải (đã lược bỏ để giảm dung lượng file) ---
const ISSUES = [
  // Danh sách các vấn đề phong thủy xấu và cách hóa giải đã được thêm vào đây
  {id:'p1', cat:'Ngoại cảnh', label:'Đối diện/ gần Bệnh viện', impact:'Âm khí, ảnh hưởng sức khỏe', remedy:'Trồng cây xanh, rèm dày, bình phong'},
  {id:'p2', cat:'Ngoại cảnh', label:'Đối diện/ gần Chùa', impact:'Âm khí mạnh, ảnh hưởng tài khí', remedy:'Bình phong, chắn cửa nhìn'},
  {id:'p3', cat:'Ngoại cảnh', label:'Đối diện Trường học', impact:'Ồn, khí động', remedy:'Rèm cách âm, vách ngăn'},
  {id:'p4', cat:'Ngoại cảnh', label:'Đường đâm thẳng vào nhà', impact:'Sát khí trực xung', remedy:'Bình phong, tiểu cảnh'},
  {id:'p5', cat:'Ngoại cảnh', label:'Ngã ba/ngã tư', impact:'Khí loạn', remedy:'Bể cá, cây xanh, bình phong'}
];
function getSelectedIssues(){
  return Array.from(document.querySelectorAll('input[name="issue"]:checked')).map(el=>el.value);
}
function checkSiteIssues(issueIds){
  const problems=[], solutions=[];
  const map = new Map(ISSUES.map(i=>[i.id,i]));
  issueIds.forEach(id=>{
    const it = map.get(id);
    if(it){ problems.push(`${it.label}: ${it.impact}`); solutions.push(`Hóa giải: ${it.remedy}`); }
  });
  return {problems, solutions};
}

// --- Lưu hồ sơ + BD (LocalStorage) ---
const STORAGE_KEY = 'ptpro_profiles_v1';
const getProfiles = ()=> JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
const setProfiles = arr => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
const uuid = ()=> (crypto?.randomUUID ? crypto.randomUUID() : 'id_'+Date.now()+Math.random().toString(16).slice(2));
function normalizePhone(phone){
  const p = (phone||'').replace(/[^\d+]/g,'').trim();
  if(p.startsWith('+84')) return p;
  if(p.startsWith('0') && p.length>=9) return '+84'+p.slice(1);
  return p;
}
function isValidPhone(phone){
  const p = normalizePhone(phone);
  const vnMobile = /^\+?84(3|5|7|8|9)\d{8}$/;
  const generic  = /^\+?\d{8,13}$/;
  return vnMobile.test(p) || generic.test(p);
}

// === TỔNG HỢP CÁC PHƯỜNG XÃ TỈNH ĐỒNG NAI ===
const DONG_NAI_WARDS = {
    'Biên Hòa': ['An Bình','Bửu Long','Hòa An','Hố Nai','Long Bình','Long Bình Tân','Phước Tân','Quang Vinh','Quang Vinh','Tân Biên','Tân Hạnh','Tân Hiệp','Tân Hòa','Tân Mai','Tân Phong','Tân Vạn','Thanh An','Thành Công','Thống Nhất','Trảng Dài'],
    'Long Thành': ['An Phước','Bình Sơn','Lộc An','Long An','Long Phước','Phước Thái','Suối Trầu'],
    'Nhơn Trạch': ['Hiệp Phước','Long Tân','Phú Đông','Phú Hội','Phú Thạnh','Phước An','Phước Khánh','Vĩnh Thanh'],
    'Định Quán': ['Gia Canh','La Ngà','Phú Cường','Phú Hòa','Thanh Sơn'],
    'Vĩnh Cửu': ['Bình Lợi','Hiếu Liêm','Hòa Bình','Mã Đà','Thạnh Phú'],
    'Trảng Bom': ['Bắc Sơn','Bình Minh','Đồi 61','Giang Điền','Hố Nai 3','Sông Trầu','Thanh Bình','Trảng Bom'],
    'Tân Phú': ['Phú Cường','Phú Lâm','Phú Lộc','Phú Trung','Phú Vĩnh','Tân Lợi'],
    'Cẩm Mỹ': ['Long Giao','Xuân Quế','Xuân Đường'],
    'Thống Nhất': ['Gia Kiệm','Gia Tân','Hưng Lộc','Lộ 25'],
    'Xuân Lộc': ['Bảo Hòa','Bảo Bình','Lang Minh','Xuân Bắc','Xuân Định','Xuân Hưng','Xuân Lộc','Xuân Tâm','Xuân Thọ','Xuân Trường']
};
function renderWardDatalist(district){
  const datalist = document.getElementById('ward-list');
  if(!datalist) return;
  const wards = DONG_NAI_WARDS[district] || [];
  datalist.innerHTML = wards.map(w=>`<option value="${w}"></option>`).join('');
}
function loadWardData(){
  // Bổ sung các phường mới vào LocalStorage nếu cần.
}

// 2) Gather inputs cho toàn bộ hồ sơ khách hàng + BD
function gatherInputs(){
  const name  = document.getElementById('kh-ten').value.trim();
  const phone = document.getElementById('kh-phone').value.trim();
  const birth = document.getElementById('ngay-sinh').value.trim();
  const gender= document.getElementById('gioi-tinh').value;
  const huongNha= document.getElementById('huong-nha').value;
  const yearX = parseInt(document.getElementById('nam-xay').value,10);
  const monthX= parseInt(document.getElementById('thang-xay').value,10);
  
  // BD fields
  const bds = {
    district: document.getElementById('bd-district').value,
    ward: document.getElementById('bd-ward').value.trim(),
    to: document.getElementById('bd-to').value.trim(),
    thua: document.getElementById('bd-thua').value.trim(),
    addressDetail: document.getElementById('bd-address-detail').value.trim(),
    price: parseFloat(document.getElementById('bd-price').value) || 0,
    note: document.getElementById('bd-note').value.trim()
  };
  bds.fullAddress = [bds.addressDetail, bds.ward, bds.district, 'Đồng Nai'].filter(Boolean).join(', ');

  return { name, phone, birth, gender, huongNha, yearX, monthX, bds, issueIds: getSelectedIssues() };
}

// 3) Lưu hồ sơ
function saveProfile(currentResult){
  const i = gatherInputs();
  if(!i.name) return alert('Vui lòng nhập họ tên khách hàng.');
  if(!i.phone) return alert('Vui lòng nhập số điện thoại.');
  if(!isValidPhone(i.phone)) return alert('SĐT chưa đúng định dạng.');
  if(!i.birth) return alert('Vui lòng nhập ngày sinh.');
  if(!i.yearX || i.yearX<1900 || i.yearX>2099) return alert('Năm xây không hợp lệ.');
  if(!i.monthX || i.monthX<1 || i.monthX>12) return alert('Tháng xây không hợp lệ.');

  const R = currentResult || evaluateAll(i.birth, i.gender, i.huongNha, i.yearX, i.monthX, i.issueIds);

  const profiles = getProfiles();
  const phoneKey = normalizePhone(i.phone);
  const existIdx = profiles.findIndex(p => p.customer.phoneKey === phoneKey);
  const profile = {
    id: existIdx>=0 ? profiles[existIdx].id : uuid(),
    createdAt: existIdx>=0 ? profiles[existIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: { name: i.name, phone: i.phone, phoneKey },
    input: { birth: i.birth, gender: i.gender, huongNha: i.huongNha, year: i.yearX, month: i.monthX, issues: i.issueIds },
    bds: i.bds,
    summary: {
      cung: R.build.cung.cung,
      menh: R.build.cung.nguyenTo,
      nhom: R.build.cung.nhomTrach,
      huongNha: i.huongNha,
      bdFullAddress: i.bds.fullAddress || '',
      bdPrice: i.bds.price || 0,
    },
    result: R
  };

  if(existIdx>=0) profiles[existIdx] = profile; else profiles.unshift(profile);
  setProfiles(profiles);
  renderProfiles();
  alert('Đã lưu hồ sơ khách hàng có BD.');
}

// 4) Render danh sách hồ sơ
function renderProfiles(filter=''){
  const tbody = document.getElementById('profiles-tbody');
  const list = getProfiles().filter(p=>{
    const key = (p.customer.name+' '+p.customer.phone).toLowerCase();
    return key.includes(filter.toLowerCase());
  });
  const fmt = s => new Date(s).toLocaleString();
  tbody.innerHTML = list.map(p=>`
    <tr data-id="${p.id}">
      <td>${p.customer.name}</td>
      <td>${p.customer.phone}</td>
      <td>${p.summary.cung} (${p.summary.menh})</td>
      <td>${p.summary.huongNha}</td>
      <td>${p.bds?.ward || ''} ${p.bds?.district || ''}</td>
      <td>${p.bds?.price ? new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(p.bds.price) : ''}</td>
      <td>${fmt(p.createdAt)}</td>
      <td class="row-actions">
        <button class="view">Xem</button>
        <button class="delete">Xóa</button>
      </td>
    </tr>
  `).join('');
}

// 5) Export CSV
function exportCSV(){
  const rows = getProfiles();
  if(rows.length===0) return alert('Chưa có dữ liệu để xuất.');
  const header = ['id','name','phone','birth','gender','huongNha','year','month','issues','cung','menh','nhom',
                  'bd_district','bd_ward','bd_to','bd_thua','bd_address_detail','bd_fullAddress','bd_price','bd_note','createdAt'];
  const csvRows = [header.join(',')];
  rows.forEach(p=>{
    const b = p.bds || {};
    const r = [
      p.id,
      `"${(p.customer.name||'').replace(/"/g,'""')}"`,
      p.customer.phone,
      p.input.birth,
      p.input.gender,
      p.input.huongNha,
      p.input.year,
      p.input.month,
      `"${(p.input.issues||[]).join('|')}"`,
      p.summary.cung,
      p.summary.menh,
      p.summary.nhom,
      b.district || '',
      b.ward || '',
      b.to || '',
      b.thua || '',
      `"${b.addressDetail||''}"`,
      `"${b.fullAddress||''}"`,
      b.price || '',
      `"${b.note||''}"`,
      p.createdAt
    ];
    csvRows.push(r.join(','));
  });
  const blob = new Blob([csvRows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'khach_hang_phong_thuy_bds.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 6) Cập nhật và load data (từ LocalStorage)
function loadBDFromProfile(p){
  if(!p) return;
  const b = p.bds || {};
  document.getElementById('bd-district').value = b.district || '';
  document.getElementById('bd-ward').value = b.ward || '';
  document.getElementById('bd-to').value = b.to || '';
  document.getElementById('bd-thua').value = b.thua || '';
  document.getElementById('bd-address-detail').value = b.addressDetail || '';
  document.getElementById('bd-price').value = b.price || '';
  document.getElementById('bd-note').value = b.note || '';
  document.getElementById('bd-address-preview').textContent = b.fullAddress || '—';
}

// 7) DOM events và logic chính
document.addEventListener('DOMContentLoaded', ()=>{
  renderProfiles();
  const bdDistrictEl = document.getElementById('bd-district');
  const bdWardEl = document.getElementById('bd-ward');
  const bdAddressDetailEl = document.getElementById('bd-address-detail');
  const bdAddressPreviewEl = document.getElementById('bd-address-preview');

  renderWardDatalist(bdDistrictEl.value);
  bdDistrictEl.addEventListener('change', (e)=>{
    renderWardDatalist(e.target.value);
    bdWardEl.value = '';
  });

  const updateAddressPreview = ()=>{
    const district = bdDistrictEl.value;
    const ward = bdWardEl.value;
    const addressDetail = bdAddressDetailEl.value;
    const fullAddress = [addressDetail, ward, district, 'Đồng Nai'].filter(Boolean).join(', ');
    bdAddressPreviewEl.textContent = fullAddress || '—';
  };
  bdDistrictEl.addEventListener('input', updateAddressPreview);
  bdWardEl.addEventListener('input', updateAddressPreview);
  bdAddressDetailEl.addEventListener('input', updateAddressPreview);
  
  const btnAnalyze = document.getElementById('btn-analyze');
  const btnSave    = document.getElementById('btn-save');
  const btnExport  = document.getElementById('btn-export');
  const searchBox  = document.getElementById('profiles-search');

  btnAnalyze?.addEventListener('click', ()=>{
    try{
      const i = gatherInputs();
      if(!i.birth) return alert('Vui lòng nhập ngày sinh.');
      if(!i.yearX || i.yearX<1900 || i.yearX>2099) return alert('Vui lòng nhập năm xây hợp lệ.');
      if(!i.monthX || i.monthX<1 || i.monthX>12) return alert('Vui lòng chọn tháng xây (1–12).');

      const R = evaluateAll(i.birth, i.gender, i.huongNha, i.yearX, i.monthX, i.issueIds);
      const r = document.getElementById('result-content');
      let html = '';

      html += `<div class="ket-luan">`;
      html += `<div><span class="badge">Cung mệnh</span> <strong>${R.build.cung.cung}</strong> — Ngũ hành: <strong>${R.build.cung.nguyenTo}</strong> — Nhóm: <strong>${R.build.cung.nhomTrach}</strong></div>`;
      html += `</div>`;

      const sel = R.dir.selected;
      html += `<h3 class="block-title">Hướng nhà: ${i.huongNha} <span class="tag ${sel?.loai||'warn'}">${sel?sel.ten:'?'}</span></h3>`;
      if(sel){
        html += `<p><em>Ý nghĩa:</em> ${sel.y}</p>`;
        const adv = adviceForDirectionClass(sel.loai);
        if(adv.length){
          html += `<p><strong>Gợi ý:</strong></p><ul class="clean">`;
          adv.forEach(a => html += `<li>${a}</li>`);
          html += `</ul>`;
        }
      }
      if(R.dir.goods?.length){
        const priority = {'Sinh Khí':1,'Thiên Y':2,'Diên Niên':3,'Phục Vị':4};
        const gsort = [...R.dir.goods].sort((a,b)=>(priority[a.ten]||9)-(priority[b.ten]||9));
        html += `<p><strong>4 hướng tốt nên ưu tiên:</strong></p><ul class="clean">` +
          gsort.map(g => `<li><span class="good">${g.huong}</span> — ${g.ten}: ${g.y}</li>`).join('') +
          `</ul>`;
      }

      html += `<hr/>`;
      html += `<h3 class="block-title">Năm/Tháng xây</h3>`;
      html += `<p>Tuổi mụ: <strong>${R.build.ageMu}</strong> — Ngũ hành năm: <strong>${R.build.yearElement}</strong> — Ngũ hành tháng: <strong>${R.build.monthElement||'?'}</strong></p>`;
      if(R.build.yearWarnings.length===0) html += `<p class="good">Năm ${i.yearX}: Không thấy cảnh báo lớn.</p>`;
      else html += `<p><strong>Cảnh báo năm ${i.yearX}:</strong></p><ul class="clean">`+R.build.yearWarnings.map(w=>`<li class="bad">${w}</li>`).join('')+`</ul>`;
      if(R.build.monthWarnings.length===0) html += `<p class="good">Tháng ${i.monthX}: Không thấy cảnh báo lớn.</p>`;
      else html += `<p><strong>Cảnh báo tháng ${i.monthX}:</strong></p><ul class="clean">`+R.build.monthWarnings.map(w=>`<li class="warn">${w}</li>`).join('')+`</ul>`;

      html += `<hr/><h3 class="block-title">Môi trường xung quanh & lỗi phong thủy</h3>`;
      if(R.site.problems.length===0) html += `<p class="good">Không phát hiện yếu tố xấu đã chọn.</p>`;
      else{
        html += `<p><strong>Vấn đề:</strong></p><ul class="clean">`+R.site.problems.map(p=>`<li class="bad">${p}</li>`).join('')+`</ul>`;
        html += `<p><strong>Hóa giải gợi ý:</strong></p><ul class="clean">`+R.site.solutions.map(s=>`<li>${s}</li>`).join('')+`</ul>`;
      }

      // BD info
      html += `<hr/><h3 class="block-title">Thông tin bất động sản (BD)</h3>`;
      if(i.bds?.fullAddress){
        html += `<p><strong>Địa chỉ BD:</strong> ${i.bds.fullAddress}</p>`;
        html += `<p><strong>Tờ / Thửa:</strong> ${i.bds.to || ''} / ${i.bds.thua || ''}</p>`;
        html += `<p><strong>Giá BD:</strong> ${i.bds.price ? new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(i.bds.price) : '0'} </p>`;
        html += `<p><strong>Ghi chú BD:</strong> ${i.bds.note || ''}</p>`;
      } else {
        html += `<p>Chưa nhập BD...</p>`;
      }
      
      document.getElementById('result-content').innerHTML = html;
    }catch(err){
      console.error(err); alert('Lỗi: '+(err.message||err));
    }
  });

  btnSave?.addEventListener('click', ()=>{ try{ saveProfile(); }catch(err){ alert('Lỗi: '+(err.message||err)); }});
  btnExport?.addEventListener('click', exportCSV);

  searchBox?.addEventListener('input', e=> renderProfiles(e.target.value));

  document.getElementById('profiles-tbody')?.addEventListener('click', e=>{
    const tr = e.target.closest('tr'); if(!tr) return;
    const id = tr.getAttribute('data-id');
    const profiles = getProfiles();
    const p = profiles.find(x=>x.id===id);
    if(!p) return;
    if(e.target.classList.contains('view')){
      if(p.bds){
        loadBDFromProfile(p);
      }
      document.getElementById('kh-ten').value = p.customer.name;
      document.getElementById('kh-phone').value = p.customer.phone;
      document.getElementById('ngay-sinh').value = p.input.birth;
      document.getElementById('gioi-tinh').value = p.input.gender;
      document.getElementById('huong-nha').value = p.input.huongNha;
      document.getElementById('nam-xay').value = p.input.year;
      document.getElementById('thang-xay').value = p.input.month;
      
      document.getElementById('btn-analyze').click();
      window.scrollTo({top:0, behavior:'smooth'});
    }
    if(e.target.classList.contains('delete')){
      if(confirm('Xóa hồ sơ này?')){
        setProfiles(profiles.filter(x=>x.id!==id));
        renderProfiles(searchBox.value);
      }
    }
  });
});
