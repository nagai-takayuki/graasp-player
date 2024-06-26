import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert } from '@mui/material';

import { FAILURE_MESSAGES } from '@graasp/translations';
import { MainMenu } from '@graasp/ui';

import { useMessagesTranslation } from '@/config/i18n';
import { ROOT_ID_PATH, buildContentPagePath } from '@/config/paths';
import { axios, hooks } from '@/config/queryClient';
import { MAIN_MENU_ID, TREE_VIEW_ID } from '@/config/selectors';
import TreeView from '@/modules/navigation/tree/TreeView';
import { isHidden } from '@/utils/item';

import LoadingTree from './tree/LoadingTree';

const { useItem, useDescendants, useItemsTags } = hooks;

const DrawerNavigation = (): JSX.Element | null => {
  const rootId = useParams()[ROOT_ID_PATH];
  const navigate = useNavigate();
  const [prevRootId, setPrevRootId] = useState(rootId);

  useEffect(() => {
    setPrevRootId(rootId);
  }, [rootId]);

  const { t: translateMessage } = useMessagesTranslation();

  const { data: descendants, isInitialLoading: isLoadingTree } = useDescendants(
    { id: rootId ?? '' },
  );
  const { data: itemsTags } = useItemsTags(descendants?.map(({ id }) => id));

  const { data: rootItem, isLoading, isError, error } = useItem(rootId);
  const handleNavigationOnClick = (newItemId: string) => {
    navigate(buildContentPagePath({ rootId, itemId: newItemId }));
  };

  // on root change, we need to destroy the tree
  // since it keeps the same data on reload despite prop changes
  // we cannot rely on isLoading because the data is taken from the cache
  // bc of our query client optimization
  if (prevRootId !== rootId) {
    return <LoadingTree />;
  }

  if (rootItem) {
    if (descendants) {
      return (
        <MainMenu id={MAIN_MENU_ID}>
          <TreeView
            id={TREE_VIEW_ID}
            rootItems={[rootItem]}
            items={[rootItem, ...(descendants || [])].filter(
              (ele) => !isHidden(ele, itemsTags?.data?.[ele.id]),
            )}
            firstLevelStyle={{ fontWeight: 'bold' }}
            onTreeItemSelect={handleNavigationOnClick}
          />
        </MainMenu>
      );
    }
    if (isLoadingTree) {
      return <LoadingTree />;
    }
  }

  if (isLoading) {
    return <LoadingTree />;
  }

  if (isError) {
    // this is an expected error that can occur if user does not have access to the item
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      return null;
    }
    return (
      <Alert severity="error">
        {translateMessage(FAILURE_MESSAGES.UNEXPECTED_ERROR)}
      </Alert>
    );
  }

  return null;
};

export default DrawerNavigation;
