import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const ListComponent = ({ toggle }) => {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    // Fetch BIHAR_PONDS_MERGED GeoJSON data
    fetch('/ap_wg_ponds_v14_2.geojson')
      .then((response) => response.json())
      .then((data) => {
        const districtCounts = {};
        const districtAreas = {};

        data.features.forEach((feature) => {
          const district = feature.properties.DISTRICT || 'Unknown';
          const area = feature.properties.AREA || 0;

          districtCounts[district] = (districtCounts[district] || 0) + 1;
          districtAreas[district] = (districtAreas[district] || 0) + area;
        });

          let listData = Object.keys(districtCounts).map((district) => ({
          district,
          ponds: districtCounts[district],
          area: districtAreas[district],
        }));

        // Sort the list in descending order based on the selected metric
        listData.sort((a, b) =>
          toggle === 'area' ? b.area - a.area : b.ponds - a.ponds
        );

        // Group the last four districts into "Others"
        if (listData.length > 4) {
          const topDistricts = listData.slice(0, listData.length - 4); // Keep all except last 4
          const otherDistricts = listData.slice(listData.length - 4); // Last 4

          const others = {
            district: 'Others',
            ponds: otherDistricts.reduce((sum, item) => sum + item.ponds, 0),
            area: otherDistricts.reduce((sum, item) => sum + item.area, 0),
          };

          listData = [...topDistricts, others]; // Combine top districts and "Others"
        }

        setListData(listData);
      })
      .catch((error) => console.error('Error fetching GeoJSON data:', error));
  }, [toggle]);

  return (
    <div className="w-full max-h-[400px] overflow-y-auto border-2 border-green-400 rounded-lg bg-transparent text-white p-3 mt-5 mx-2">
      <div className="flex justify-between font-bold mb-2 border-b-2 border-green-400 pb-1">
        <span>District</span>
        <span>{toggle === 'area' ? 'Area (Ha)' : 'Ponds'}</span>
      </div>
      <div className="flex flex-col">
        {listData.map((item) => (
          <div key={item.district} className="flex justify-between">
            <div>{item.district}</div>
            <div>
              {toggle === 'area' ? item.area.toFixed(2) : item.ponds}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add PropTypes validation
ListComponent.propTypes = {
  toggle: PropTypes.string.isRequired, // `toggle` must be a string and required
};

export default ListComponent;
