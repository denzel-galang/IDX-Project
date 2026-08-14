import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchID, fetchOH } from '../api/client';
import './PropertyDetailPage.css';
import PropertyImageGallery from '../components/PropertyImageGallery';
import PropertyMap from '../components/PropertyMap';
import FavoriteButton from '../components/FavoriteButton';

const PropertyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [openHouses, setOpenHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                setError(null);

                const [propertyData, openHouseData] = await Promise.all([
                    fetchID(id),
                    fetchOH(id)
                ]);

                setProperty(propertyData);
                setOpenHouses(openHouseData.results);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) {
        return <div className="detail__status">Loading property...</div>;
    }
    if (error) {
        return <div className="detail__status detail__status--error">{error}</div>;
    }
    if (!property) {
        return null;
    }

    const {
        L_Address,
        L_City,
        L_State,
        L_Zip,
        L_SystemPrice,
        L_Keyword2 : beds,
        LM_Dec_3 : baths,
        LM_Int2_3 : sqft,
        YearBuilt,
        L_Remarks,
        L_Type_,
        L_Status,
        L_ListingID,
        L_DisplayId,
        SubdivisionName,
        CountyOrParish,
        LotSizeAcres,
        DaysOnMarket,
        AssociationFee,
        AssociationFeeFrequency,
        AssociationYN,
        Flooring,
        Cooling,
        Heating,
        Roof,
        View,
        ViewYN,
        PoolPrivateYN,
        PoolFeatures,
        FireplaceYN,
        FireplaceFeatures,
        GarageYN,
        AttachedGarageYN,
        NewConstructionYN,
        InteriorFeatures,
        CommunityFeatures,
        ListAgentFullName,
        ListAgentDirectPhone,
        ListAgentOfficePhone,
        ListAgentEmail,
        ListOfficeEmail,
        L01_OrganizationName,
        LA1_UserFirstName,
        LA1_UserLastName,
        ListingContractData,
        LMD_MP_Latitude,
        LMD_MP_Longitude
    } = property;

    const getPhotos = () => {
        try {
            const photos = typeof property.L_Photos === 'string'
                ? JSON.parse(property.L_Photos)
                : property.L_Photos;
            return Array.isArray(photos) ? photos.filter(url => {
                try {
                    new URL(url);
                    return true;
                } 
                catch {
                    return false;
                }
            }) : [];
        }
        catch {
            return [];
        }
    };

    const photos = getPhotos();
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return 'N/A';
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    const formatYN = (val) => {
        if (val === null || val === undefined) return 'N/A';
        if (val === 1 || val === '1' || val === 'Yes') return 'Yes';
        if (val === 0 || val === '0' || val === 'No' || val === '') return 'No';
        return val;
    }

    const agentName = ListAgentFullName || [LA1_UserFirstName, LA1_UserLastName].filter(Boolean).join(' ') || 'N/A';

    const destination = encodeURIComponent(
        `${L_Address}, ${L_City}, ${L_State}, ${L_Zip}`
    );
    const addressDirectionsUrl = `https:/www.google.com/maps/dir/?api=1&destination=${destination}`;
    const coordsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${LMD_MP_Latitude},${LMD_MP_Longitude}`;

    return (
        <div className="detail">
            <button className="detail__back" onClick={() => navigate(-1)}>
                ← Back to Listings
            </button>

            <PropertyImageGallery photos={photos} address={L_Address} />

            <div className="detail__price-row">
                <p className="detail__price">
                    ${parseInt(L_SystemPrice).toLocaleString()}
                </p>
                <FavoriteButton property={property} size="lg" />                
            </div>
            <h1 className="detail__address">{L_Address}</h1>
            <p className="detail__city">{L_City}, {L_State} {L_Zip}</p>
            <p className="detail__meta">
                {L_Status && <span className="detail__badge">{L_Status}</span>}
                {DaysOnMarket !== null && <span>{DaysOnMarket} days on market</span>}
                {ListingContractData && <span>Listed {formatDate(ListingContractData)}</span>}
            </p>

            <div className="detail__stats">
                <div className="detail__stat">
                    <span className="detail__stat-value">{beds ?? 'N/A'}</span>
                    <span className="detail__stat-label"> Beds</span>
                </div>
                <div className="detail__stat-divider" />
                <div className="detail__stat">
                    <span className="detail__stat-value">{baths ?? 'N/A'}</span>
                    <span className="detail__stat-label"> Baths</span>
                </div>
                <div className="detail__stat-divider" />
                <div className="detail__stat">
                    <span className="detail__stat-value">
                        {sqft ? parseInt(sqft).toLocaleString() : 'N/A'}
                    </span>
                    <span className="detail__stat-label"> Sq Ft</span>
                </div>
                <div className="detail__stat-divider" />
                <div className="detail__stat">
                    <span className="detail__stat-label">Built</span>
                    <span className="detail__stat-value"> {YearBuilt ?? 'N/A'}</span>
                </div>
                {LotSizeAcres && (
                    <>
                        <div className="detail__stat-divider" />
                        <div className="detail__stat">
                            <span className="detail__stat-value">
                                {parseFloat(LotSizeAcres).toFixed(2)}
                            </span>
                            <span className="detail__stat-label"> Acres</span>
                        </div>
                    </>
                )}
            </div>

            <div className="detail__section">
                <h2 className="detail__section-title">Location</h2>
                <PropertyMap
                    latitude={LMD_MP_Latitude}
                    longitude={LMD_MP_Longitude}
                    address={L_Address}
                />
                <p className="detail__map-address">
                    {L_Address}, {L_City}, {L_State} {L_Zip}
                </p>
            </div>

            {L_Address && (
                <a
                    href={addressDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Get Directions
                </a>
            )}

            {L_Remarks && (
                <div className="detail__section">
                    <h2 className="detail__section-title">Description</h2>
                    <p className="detail__description">{L_Remarks}</p>
                </div>
            )}

            <div className="detail__section">
                <h2 className="detail__section-title">Property Details</h2>
                <div className="detail__details-grid">
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Listing ID: </span>
                        <span className="detail__detail-value">{L_DisplayId || L_ListingID}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Property Type: </span>
                        <span className="detail__detail-value">{L_Type_ || 'N/A'}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Subdivision: </span>
                        <span className="detail__detail-value">{SubdivisionName || 'N/A'}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">County: </span>
                        <span className="detail__detail-value">{CountyOrParish || 'N/A'}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Year Built: </span>
                        <span className="detail__detail-value">{YearBuilt || 'N/A'}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Flooring: </span>
                        <span className="detail__detail-value">{Flooring || 'N/A'}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Cooling: </span>
                        <span className="detail__detail-value">{Cooling || 'N/A'}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Heating: </span>
                        <span className="detail__detail-value">{Heating || 'N/A'}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Roof: </span>
                        <span className="detail__detail-value">{Roof || 'N/A'}</span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">View: </span>
                        <span className="detail__detail-value">
                            {ViewYN ? View || 'Yes' : 'No'}
                        </span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Pool: </span>
                        <span className="detail__detail-value">
                            {formatYN(PoolPrivateYN)} {PoolFeatures ? ` - (${PoolFeatures})` : ''}
                        </span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Fireplace: </span>
                        <span className="detail__detail-value">
                            {formatYN(FireplaceYN)} {FireplaceFeatures ? ` - (${FireplaceFeatures})` : ''}
                        </span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Garage: </span>
                        <span className="detail__detail-value">
                            {formatYN(GarageYN)} {AttachedGarageYN ? ' - Attached' : ''}
                        </span>
                    </div>
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">New Construction: </span>
                        <span className="detail__detail-value">{formatYN(NewConstructionYN)}</span>
                    </div>
                    {AssociationYN ? (
                        <div className="detail__detail-item">
                            <span className="detail__detail-label">Association Fee: </span>
                            <span className="detail__detail-value">
                                {AssociationFee ? `$${parseInt(AssociationFee).toLocaleString()} / ${AssociationFeeFrequency || 'month'}` : 'N/A'}
                            </span>
                        </div>
                    ) : (
                        <div className="detail__detail-item">
                            <span className="detail__detail-label">Association Fee: </span>
                            <span className="detail__detail-value">N/A</span>
                        </div>
                    )}
                </div>
            </div>

            {(InteriorFeatures || CommunityFeatures) && (
                <div className="detail__section">
                    <h2 className="detail__section-title">Features & Amentities</h2>
                    <div className="detail__features-grid">
                        {InteriorFeatures && (
                            <div className="detail__detail-item detail__detail-item--full">
                                <span className="detail__detail-label">Interior Features: </span>
                                <span className="detail__detail-value">{InteriorFeatures}</span>
                            </div>
                        )}
                        {CommunityFeatures && (
                            <div className="detail__detail-item detail__detail-item--full">
                                <span className="detail__detail-label">Community Features: </span>
                                <span className="detail__detail-value">{CommunityFeatures}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="detail__section">
                <h2 className="detail__section-title">Listing Agent</h2>
                <div className="detail__details-grid">
                    <div className="detail__detail-item">
                        <span className="detail__detail-label">Agent Name: </span>
                        <span className="detail__detail-value">{agentName}</span>
                    </div>
                    {ListAgentDirectPhone && (
                        <div className="detail__detail-item">
                            <span className="detail__detail-label">Agent Phone: </span>
                            <span className="detail__detail-value">
                                <a href={`tel:${ListAgentDirectPhone}`}>{ListAgentDirectPhone}</a>
                            </span>
                        </div>
                    )}
                    {ListAgentOfficePhone && (
                        <div className="detail__detail-item">
                            <span className="detail__detail-label">Office Phone: </span>
                            <span className="detail__detail-value">
                                <a href={`tel:${ListAgentOfficePhone}`}>{ListAgentOfficePhone}</a>
                            </span>
                        </div>
                    )}
                    {ListAgentEmail && (
                        <div className="detail__detail-item">
                            <span className="detail__detail-label">Agent Email: </span>
                            <span className="detail__detail-value">
                                <a href={`mailto:${ListAgentEmail}`}>{ListAgentEmail}</a>
                            </span>
                        </div>
                    )}
                    {ListOfficeEmail && (
                        <div className="detail__detail-item">
                            <span className="detail__detail-label">Office Email: </span>
                            <span className="detail__detail-value">
                                <a href={`mailto:${ListOfficeEmail}`}>{ListOfficeEmail}</a>
                            </span>
                        </div>
                    )}
                    {L01_OrganizationName && (
                        <div className="detail__detail-item">
                            <span className="detail__detail-label">Brokerage: </span>
                            <span className="detail__detail-value">{L01_OrganizationName}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="detail__section">
                <h2 className="detail__section-title">Open Houses</h2>
                {openHouses.length === 0 ? (
                    <p className="detail__no-openhouses">No open houses scheduled.</p>
                ) : (
                    <div className="detail__openhouses">
                        {openHouses.map((oh, index) => (
                            <div key={index} className="detail__openhouse">
                                <div className="detail__openhouse-date">
                                    {formatDate(oh.OpenHouseDate)}
                                </div>
                                <div className="detail__openhouse-time">
                                    {formatTime(oh.OH_StartTime)} - {formatTime(oh.OH_EndTime)}
                                </div>
                                <div className="detail__section">
                                    <h2 className="detail__section-title">Open House Description</h2>
                                    <p className="detail__description">
                                        {JSON.parse(oh.all_data).OpenHouseRemarks || "No description available."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyDetailPage;
