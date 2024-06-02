import React from 'react';

const Imprint: () => React.JSX.Element = () => {
  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100 select-none">
      <div className="w-80 md:w-96 p-8 rounded-lg bg-white border-2 border-gray-200">
        <div className="text-left">
          <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-purple-700">
            {import.meta.env.HTML_TITLE || 'env.HTML_TITLE missing'}
          </p>
        </div>

        <div className="flex flex-col justify-center items-start text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-light">Impressum</span>
          <div className="flex flex-col mt-6 lg:mt-10">
            {import.meta.env.IMPRINT_ADDRESS_LINE_1 && (
              <span className="text-base font-light">{import.meta.env.IMPRINT_ADDRESS_LINE_1}</span>
            )}
            {import.meta.env.IMPRINT_ADDRESS_LINE_2 && (
              <span className="text-base font-light">{import.meta.env.IMPRINT_ADDRESS_LINE_2}</span>
            )}
            {import.meta.env.IMPRINT_ADDRESS_LINE_3 && (
              <span className="text-base font-light">{import.meta.env.IMPRINT_ADDRESS_LINE_3}</span>
            )}
            {import.meta.env.IMPRINT_ADDRESS_LINE_4 && (
              <span className="text-base font-light">{import.meta.env.IMPRINT_ADDRESS_LINE_4}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center items-start text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-light">Kontakt</span>
          <div className="flex flex-col mt-6 lg:mt-10">
            {import.meta.env.IMPRINT_CONTACT_PHONE && (
              <span className="text-base font-light">
                Telefon:{' '}
                <a
                  href={'tel:' + import.meta.env.IMPRINT_CONTACT_PHONE}
                  className="hover:font-normal">
                  {import.meta.env.IMPRINT_CONTACT_PHONE}
                </a>
              </span>
            )}
            {import.meta.env.IMPRINT_CONTACT_EMAIL && (
              <span className="text-base font-light">
                E-Mail:{' '}
                <a
                  href={'mailto:' + import.meta.env.IMPRINT_CONTACT_EMAIL}
                  className="hover:font-normal">
                  {import.meta.env.IMPRINT_CONTACT_EMAIL.replace('@', ' [at] ')}
                </a>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
