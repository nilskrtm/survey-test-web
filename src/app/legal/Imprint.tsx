import React from 'react';

const Imprint: () => React.JSX.Element = () => {
  return (
    <div className="h-full w-full flex justify-center items-center bg-gray-100 select-none">
      <div className="w-[420px] p-8 rounded-lg bg-white border-2 border-gray-200">
        <div className="text-left">
          <p className="text-lg lg:text-xl xl:text-2xl font-semibold text-purple-700">
            {import.meta.env.VITE_HTML_TITLE || 'env.VITE_HTML_TITLE missing'}
          </p>
        </div>

        <div className="flex flex-col justify-center items-start text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-light">Impressum</span>
          <div className="mt-6 lg:mt-10"></div>
          {import.meta.env.VITE_IMPRINT_ADDRESS ? (
            import.meta.env.VITE_IMPRINT_ADDRESS?.split(';').map((line: string, index: number) => {
              return (
                <span
                  key={'imprint_contact_line_' + index}
                  className="text-base font-light"
                  dangerouslySetInnerHTML={{ __html: line }}></span>
              );
            })
          ) : (
            <span className="text-base font-light">env.VITE_IMPRINT_ADDRESS missing</span>
          )}
        </div>

        <div className="flex flex-col justify-center items-start text-left mt-4 lg:mt-6">
          <span className="text-xl lg:text-2xl xl:text-4xl font-light">Kontakt</span>
          <div className="mt-6 lg:mt-10"></div>
          {import.meta.env.VITE_IMPRINT_CONTACT ? (
            import.meta.env.VITE_IMPRINT_CONTACT?.split(';').map((line: string, index: number) => {
              return (
                <span
                  key={'imprint_contact_line_' + index}
                  className="text-base font-light"
                  dangerouslySetInnerHTML={{ __html: line }}></span>
              );
            })
          ) : (
            <span className="text-base font-light">env.VITE_IMPRINT_CONTACT missing</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Imprint;
