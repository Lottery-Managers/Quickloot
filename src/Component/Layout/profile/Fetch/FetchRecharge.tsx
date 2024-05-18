import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase/Firebase';

interface Recharge {
  id: string;
  rechargeAmount: number;
  timestamp: any; // Firebase timestamp object
  utrNumber: string;
}

const RechargeTable: React.FC = () => {
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecharges();
  }, []);

  const fetchRecharges = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "RechargeList")));
      const loadedRecharges: Recharge[] = querySnapshot.docs.map(doc => ({
        ...doc.data() as Recharge,
        id: doc.id  // Assuming 'id' is the document ID
      }));
      setRecharges(loadedRecharges);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recharge documents:", err);
      setError("Failed to load recharges.");
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "RechargeList", docId));
      setRecharges(prev => prev.filter(item => item.id !== docId));  // Update state to reflect deletion
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete the document.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Recharge List</h1>
      <div className="max-h-[400px] overflow-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Recharge Amount</th>
              <th scope="col" className="px-6 py-3">Timestamp</th>
              <th scope="col" className="px-6 py-3">UTR Number</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recharges.map(({ id, rechargeAmount, timestamp, utrNumber }) => (
              <tr key={id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{rechargeAmount}</td>
                <td className="px-6 py-4">{timestamp.toDate().toLocaleString()}</td>
                <td className="px-6 py-4">{utrNumber}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleDelete(id)}
                    className="text-red-500 hover:text-red-700">Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RechargeTable;