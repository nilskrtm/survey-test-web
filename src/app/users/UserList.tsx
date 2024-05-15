import React, { createRef, useEffect, useState } from 'react';
import useDashboardTitle from '../../utils/hooks/use.dashboard.title.hook';
import useQueryParams, { QuerySearchParams } from '../../utils/hooks/use.query.params.hook';
import useLoader, { LoadingOption } from '../../utils/hooks/use.loader.hook';
import usePagination from '../../utils/hooks/use.pagination.hook';
import { User } from '../../data/types/user.types';
import CreateUserModal, {
  CreateUserModalRefAttributes
} from '../../components/users/CreateUserModal';
import UserService from '../../data/services/user.service';
import { parseQuerySearchParams } from '../../utils/query/query.params.util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamation,
  faFaceFrownOpen,
  faMagnifyingGlass,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { BounceLoader } from 'react-spinners';
import PagingBox from '../../components/paging/PagingBox';
import { NavLink } from 'react-router-dom';

interface UserListQueryParams extends QuerySearchParams {
  page: number;
  keyword: string;
  sortingType: string;
  sortingOption: string;
}

type UserFilterOptions = {
  keyword: string;
};

const UserList: () => React.JSX.Element = () => {
  useDashboardTitle('Nutzerverwaltung');

  const [queryParams, setQueryParams] = useQueryParams({
    page: 1,
    keyword: '',
    sortingOption: '',
    sortingType: ''
  });

  const [filterOptions, setFilterOptions] = useState<UserFilterOptions>({
    keyword: ''
  });
  const [sortingType, setSortingType] =
    useState<Pick<UserListQueryParams, 'sortingType'>['sortingType']>('');
  const [sortingOption, setSortingOption] =
    useState<Pick<UserListQueryParams, 'sortingOption'>['sortingOption']>('');

  const loader = useLoader();
  const pagination = usePagination(10);
  const [users, setUsers] = useState<Array<User>>([]);

  const createUserModalRef = createRef<CreateUserModalRefAttributes>();

  useEffect(() => {
    const { page, keyword, sortingOption, sortingType } =
      parseQuerySearchParams<UserListQueryParams>(queryParams);
    const newFilterOptions: UserFilterOptions = {
      keyword: keyword ? keyword : ''
    };

    setFilterOptions(newFilterOptions);
    setSortingOption(sortingOption);
    setSortingType(sortingType);
    loadUsers(page, newFilterOptions, sortingOption, sortingType);
  }, [queryParams]);

  const loadUsers = (
    requestedPage: number,
    filterOptions: UserFilterOptions,
    searchSortingOption: string,
    searchSortingType: string
  ) => {
    loader.set(LoadingOption.LOADING);

    UserService.getUsers(requestedPage, pagination.perPage, {
      ...filterOptions,
      sortingOption: searchSortingOption,
      sortingType: searchSortingType
    }).then((response) => {
      if (response.success) {
        setUsers(response.data.users);
        pagination.update(response.data.paging, response.data.users.length);
        loader.set(LoadingOption.RESET);
      } else {
        loader.set(LoadingOption.ERROR);
      }
    });
  };

  const updateQuery: (param: keyof UserListQueryParams, value: string | number) => void = (
    param,
    value
  ) => {
    if (value != undefined) {
      setQueryParams((prev) => {
        return { ...prev, [param]: value };
      });
    }
  };

  const createUser: () => void = () => {
    createUserModalRef.current?.open();
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-between space-y-8 p-6 overflow-y-auto">
        <div className="w-full flex flex-row items-center rounded-lg bg-white border border-gray-200 py-4 px-6">
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4">
              <div className="w-full lg:w-1/2 flex flex-row items-center justify-start">
                <div className="relative w-full flex flex-row items-center justify-start">
                  <input
                    className="form-input w-full pl-11 rounded-md font-normal text-base text-black placeholder-shown:text-gray-600 focus:text-black focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 peer"
                    placeholder="Suchen..."
                    value={filterOptions.keyword}
                    onChange={(event) =>
                      setFilterOptions((prev) => ({ ...prev, keyword: event.target.value }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        updateQuery('keyword', filterOptions.keyword);
                      }
                    }}
                    onBlur={() => updateQuery('keyword', filterOptions.keyword)}
                  />
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    size="1x"
                    className="absolute left-4 text-xl text-gray-600 peer-focus:text-purple-800"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-row items-center justify-between gap-2">
                <select
                  value={sortingOption}
                  onChange={(event) => {
                    if (event.target.value === '') {
                      setQueryParams((prev) => {
                        return { ...prev, sortingOption: event.target.value, sortingType: '' };
                      });
                    } else {
                      if (sortingType === '') {
                        setQueryParams((prev) => {
                          return {
                            ...prev,
                            sortingOption: event.target.value,
                            sortingType: 'ascending'
                          };
                        });
                      } else {
                        updateQuery('sortingOption', event.target.value);
                      }
                    }
                  }}
                  className="form-select w-1/2 rounded-md font-normal text-base truncate focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500">
                  <option value="">Option wählen</option>
                  <option value="name">Nutzername</option>
                  <option value="email">E-Mail Adresse</option>
                  <option value="firstname">Vorname</option>
                  <option value="lastname">Nachname</option>
                  {/* TODO
                <option value="edited">Bearbeitungsdatum</option>
                <option value="created">Erstelldatum</option>
                */}
                </select>
                <select
                  value={sortingType}
                  disabled={!sortingOption}
                  onChange={(event) => {
                    updateQuery('sortingType', event.target.value);
                  }}
                  className="form-select w-1/2 rounded-md font-normal text-base truncate focus:outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500">
                  <option value="">Art wählen</option>
                  {sortingOption === 'name' ||
                  sortingOption === 'email' ||
                  sortingOption === 'firstname' ||
                  sortingOption === 'lastname' ? (
                    <>
                      <option value="ascending">A zu Z</option>
                      <option value="descending">Z zu A</option>
                    </>
                  ) : (
                    <>
                      <option value="ascending">zuletzt zum Schluss</option>
                      <option value="descending">zuletzt zuerst</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="w-full flex flex-wrap flex-row items-center justify-between gap-x-2 gap-y-2 lg:gap-y-4">
              <div></div>
              <button
                onClick={createUser}
                className="max-lg:w-full flex items-center justify-center space-x-1 px-3 py-[9px] rounded-md bg-purple-700 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                title="Neuen Nutzer erstellen">
                <FontAwesomeIcon
                  icon={faPlus}
                  size="1x"
                  fixedWidth
                  className="text-white text-lg"
                />
                <span>Neuer Nutzer</span>
              </button>
            </div>
          </div>
        </div>
        {loader.loading && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <BounceLoader color="rgb(126 34 206)" size={70} />
            <p className="text-medium font-medium text-gray-700">Abruf der Nutzer</p>
          </div>
        )}
        {loader.error && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <FontAwesomeIcon icon={faExclamation} size="1x" className="text-4xl text-red-500" />
            <p className="text-medium font-medium text-gray-700">Abruf der Nutzer fehlgeschlagen</p>
          </div>
        )}
        {!loader.loading && !loader.error && users.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <FontAwesomeIcon icon={faFaceFrownOpen} size="1x" className="text-4xl text-gray-700" />
            <p className="text-medium font-medium text-gray-700">Keine Nutzer vorhanden</p>
          </div>
        )}
        {!loader.loading && !loader.error && users.length > 0 && (
          <div className="w-full flex-auto grid auto-rows-min grid-cols-1 md:grid-cols-2 gap-4 gap-y-4">
            {users.map((user) => {
              return (
                <NavLink
                  className="w-full rounded-lg bg-white border border-gray-200 hover:ring-1 hover:ring-purple-500"
                  key={'user-card-' + user._id}
                  to={'/users/' + user._id}>
                  <div className="w-full flex flex-row items-start justify-between py-6 px-6">
                    <div className="w-full flex flex-col items-center justify-start">
                      <span
                        className="w-full font-semibold text-xl text-black whitespace-break-spaces truncate"
                        title={user.firstname + ' ' + user.lastname}>
                        {user.firstname + ' ' + user.lastname}
                      </span>
                      <span className="w-full font-semibold text-md text-gray-600 whitespace-break-spaces truncate">
                        {user.username}
                      </span>
                    </div>
                  </div>
                  <hr className="w-full h-[1px] bg-gray-200" />
                </NavLink>
              );
            })}
          </div>
        )}

        <PagingBox pagination={pagination} openPage={(number) => updateQuery('page', number)} />
      </div>

      {/* create user modal */}
      <CreateUserModal ref={createUserModalRef} />
    </>
  );
};

export default UserList;
