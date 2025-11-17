export default function BookingRow({ data }) {
  return (
    <div className="p-4 bg-white border rounded-lg shadow mb-3">
      <h3 className="font-semibold">{data.user}</h3>
      <p>Station: {data.station}</p>
      <p>Date: {data.date}</p>
      <p>Time: {data.time}</p>
      <p>Status: {data.status}</p>
    </div>
  );
}
