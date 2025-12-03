import React from "react";
import { forAdminOnly } from "../components/ForAdminOnly";
function Bids() {
  return <div>Bids</div>;
}

export default forAdminOnly(Bids);
