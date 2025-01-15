export const fetchData = async () => {
  const promises = [
    fetch("/Geojson/WG_district_new_boundary.geojson"),
    fetch("/Geojson/ap_wg_ponds_v14_2.geojson"),
  ];

  const result = await Promise.all(promises);

  const subdistricts = result[0];
  const godrej_data_final = result[1];

  if (!subdistricts.ok) {
    throw new Error(
      `Failed to fetch subdistricts GeoJSON data: ${subdistricts.statusText}`
    );
  }
  if (!godrej_data_final.ok) {
    throw new Error(
      `Failed to fetch GeoJSON data: ${godrej_data_final.statusText}`
    );
  }

  const subdistricts_data = await subdistricts.json();
  const godrej_data_final_data = await godrej_data_final.json();

  return [subdistricts_data, godrej_data_final_data];
};
