import React from "react";
import { NamespacesConsumer } from 'react-i18next';

const NoMatch = () => (
    <NamespacesConsumer>
    {
        t => <div>
            <h3>{t('No Match')}</h3>
        </div>
    }
    </NamespacesConsumer>
      
);

export default NoMatch;