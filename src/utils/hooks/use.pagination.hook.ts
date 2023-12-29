interface Pagination {
  count: number;
  update: () => void;
}

const usePagination: () => Pagination = () => {
  const updateIntern = () => {
    console.log('test');
  };

  return { count: 0, update: updateIntern };
};

export default usePagination;
