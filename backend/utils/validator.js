function validateHotel(data) {
  if (!data.name) return "Nama hotel wajib diisi";
  if (!data.address) return "Alamat wajib diisi";
  if (!data.city) return "Kota wajib diisi";
  return null;
}

function validateId(id) {
  if (!id || isNaN(id)) return "ID tidak valid";
  return null;
}

module.exports = { validateHotel, validateId };
