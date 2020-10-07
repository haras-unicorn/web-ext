import React from 'react';

import { useUserValue } from '../../providers/user/hooks';


// TODO: user server query, data and such
const UserPage: React.FC = () =>
{
    const user = useUserValue();
    if (user)
    {
        return (
                <p>Dobrodošli, {user?.username}.</p>
        );
    }

    return null;
};


export default UserPage;
