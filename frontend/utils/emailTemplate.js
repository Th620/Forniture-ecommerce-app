const generateEmailTemplate = ({ name, date, address }) => {
  return `<div>
      <p>Dear ${name.toUpperCase()}</p>
      <p>This is to confirm our meeting to discuss your custom order:</p>
      <p>
        <span>Date:</span> 
        ${date.toLocaleDateString("es-CL", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}
      </p>
      <p>
        <span>Time:</span> 
        ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p>
        <span>Location:</span> ${address}
      </p>
      <p>
        Please let us know if this works for you or if you need to reschedule.
      </p>
    </div>`;
};

module.exports = { generateEmailTemplate };
