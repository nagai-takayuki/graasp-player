import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Stack } from '@mui/material';

import { Button, ForbiddenContent } from '@graasp/ui';

import { usePlayerTranslation } from '@/config/i18n';
import { useCurrentMemberContext } from '@/contexts/CurrentMemberContext';
import { PLAYER } from '@/langs/constants';
import UserSwitchWrapper from '@/modules/userSwitch/UserSwitchWrapper';

const ItemForbiddenScreen = (): JSX.Element => {
  const { t } = usePlayerTranslation();
  const { data: member } = useCurrentMemberContext();

  const ButtonContent = (
    <Button variant="outlined" startIcon={<AccountCircleIcon />}>
      {t(PLAYER.SIGN_IN_BUTTON_TEXT)}
    </Button>
  );

  return (
    <Stack
      direction="column"
      height="100%"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <ForbiddenContent
        memberId={member?.id}
        title={t(PLAYER.ERROR_ACCESSING_ITEM)}
        authenticatedText={t(PLAYER.ERROR_ACCESSING_ITEM_HELPER)}
      />
      <UserSwitchWrapper ButtonContent={ButtonContent} preserveUrl />
    </Stack>
  );
};

export default ItemForbiddenScreen;
