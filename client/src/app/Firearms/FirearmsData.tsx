import { useEffect, useState } from "react";

export interface Repository {
  id: BigInt;
  manufacturer: string;
  model: string;
  purchase_date: string;
  caliber: string;
  serial_number: string;
}

function AddFirearms(newFirearm) {
  fetch("http://localhost:3000/api/v1/firearms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFirearm),
  })
    .then((response) => {
      if (response.ok) {
        console.log("It works");
      }
    })
    .catch((error) => {
      console.log(error);
    });

  console.log("Fired firearm POST");
}

const GetFirearms = () => {
  const [data, setData] = useState<Repository[]>([]);

  const fetchFirearmData = () => {
    fetch("http://localhost:3000/api/v1/firearms")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      });
  };

  useEffect(() => {
    fetchFirearmData();
  }, []);

  return { data };
};

export { GetFirearms, AddFirearms };
