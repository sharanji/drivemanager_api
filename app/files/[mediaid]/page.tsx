import React from "react";
import Image from "next/image";

const page = ({ params }: { params: { mediaid: any } }) => {
  return (
    <div>
      <Image
        alt="logo"
        width="100"
        height="100"
        src={"/uploads/files/" + params.mediaid}
      ></Image>
    </div>
  );
};

export default page;
