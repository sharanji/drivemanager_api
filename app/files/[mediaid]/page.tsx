import React from "react";

const page = ({ params }: { params: { mediaid: any } }) => {
  return (
    <div>
      <iframe
        style={{ height: "100vh", width: "100vw" }}
        src={"/uploads/files/" + params.mediaid}
      ></iframe>
    </div>
  );
};

export default page;
