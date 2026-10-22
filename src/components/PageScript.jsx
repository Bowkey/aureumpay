import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PageScript({ mount }) {
  const navigate = useNavigate();

  useEffect(() => mount(navigate), [mount, navigate]);
  return null;
}
