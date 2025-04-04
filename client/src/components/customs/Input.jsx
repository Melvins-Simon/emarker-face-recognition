import React, { useRef } from "react";

const Input = ({ ...options }) => {
  const ring = useRef(null);
  return (
    <div>
      <label htmlFor={options.name} className="font-semibold">
        {options.label}
      </label>
      <div
        ref={ring}
        className="bg-indigo-300/30 relative px-10 rounded-sm placeholder:text-sm ring-[1px] transition-all mt-1"
      >
        <input
          onFocus={() => ring.current.classList.add("ring-blue-400")}
          onBlur={() => ring.current.classList.remove("ring-blue-400")}
          className="w-full outline-none py-2"
          type={options.type}
          onChange={options.onchange}
          value={options.value}
          placeholder={options.placeholder}
          name={options.name}
          required
        />
        {options.icon1 && (
          <options.icon1 className="size-5 absolute inset-y-0 left-3 m-auto" />
        )}
        {options.icon2 && (
          <options.icon2
            onClick={options.ontap}
            className="size-5 cursor-pointer absolute inset-y-0 right-3 m-auto"
          />
        )}
      </div>
    </div>
  );
};

export default Input;
