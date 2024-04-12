import React, { useContext } from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import AppContext from '../../context/AppContext';
import { boxFields } from '../../constants';

const BoxInfo = ({ box, width = null, height = null }) => {
  const { isMobile } = useContext(AppContext);
  const { t } = useTranslation();

  if (!box) return null;
  return (
    <Card sx={{ width: width ? width : '100%', height: height ? height : '100%' }} >
      <CardContent>
        <Typography color="text.secondary" variant="overline">
          Informations
        </Typography>
        <Stack
          direction={'row'}
          spacing={5}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Stack direction={'column'} spacing={0.5}>
            {boxFields.map((field, index) => {
              if (box[field])
                return (
                  <Typography key={index}>
                    <code>{t(field)}</code>: <strong>{box[field]}</strong>
                  </Typography>
                );
            })}
          </Stack>
          {isMobile
            ? null
            :
            <QRCodeSVG value={'tnt://' + box?.id} size={150} level='H' />
          }
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BoxInfo;
