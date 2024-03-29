import React, { useCallback, useState } from 'react';
import { fromLonLat, toLonLat } from 'ol/proj';
import { MapBrowserEvent } from 'ol';
import { Point } from 'ol/geom';
import 'ol/ol.css';
import {
	RMap,
	ROSM,
	RControl,
	RLayerVector,
	RFeature,
	RStyle,
	RInteraction,
	
} from 'rlayers';

const origin = [78.345, 22.91];
const center = fromLonLat(origin);

export default function Map(): JSX.Element {
	const [loc, setLoc] = useState(origin);
	const [markers, setMarkers] = useState([]);
	const [hoverCoords, setHoverCoords] = useState([0, 0]);
	const [addMarkerMode, setAddMarkerMode] = useState(false);
	const [drawType, setDrawType] = useState('None');


	const handleClick = useCallback(
		(e: MapBrowserEvent<UIEvent>) => {
			
			if (addMarkerMode) {
			
				const coords = toLonLat(e.map.getCoordinateFromPixel(e.pixel));
				setLoc(coords);
				const newMarker = {
					id: Date.now(),
					coords: coords,
				};
				setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
			}
		},
		[addMarkerMode, drawType]
	);

	const handleMarkerClick = (id) => {
		setMarkers((currentMarkers) => currentMarkers.filter((marker) => marker.id !== id));
	};

	const toggleMarkerMode = () => {
		setAddMarkerMode((prevMode) => !prevMode);
		setDrawType('None');
	};

	const handleMouseMove = useCallback((e) => {
		const coords = toLonLat(e.coordinate);
		setHoverCoords(coords);
	}, []);

	

	const handleDrawTypeChange = (type: string) => {
		setDrawType(type);
	};
	
	// Function to clear all markers
	const clearMarkers = () => {
		setMarkers([]);

		setDrawType('None');
	};

	return (
		<>
			<div style={{ position: 'relative' }}>
				<RMap
					className='example-map'
					width={'100%'}
					height={'85vh'}
					initial={{ center: center, zoom: 12 }}
					onPointerMove={handleMouseMove}
					onClick={handleClick}
				>
					<ROSM />
					<RControl.RScaleLine />
					<RControl.RAttribution />
					<RControl.RZoom />
					<RControl.RZoomSlider />
					<RLayerVector>
						{markers.map((marker) => (
							<RFeature
								key={marker.id}
								geometry={new Point(fromLonLat(marker.coords))}
								onClick={() => handleMarkerClick(marker.id)}
							>
								<RStyle.RStyle>
									<RStyle.RIcon
										src='https://openlayers.org/en/latest/examples/data/icon.png'
										anchor={[0.5, 1]}
									/>
								</RStyle.RStyle>
							</RFeature>
						))}
					</RLayerVector>

					<RLayerVector>
						<RStyle.RStyle>
							<RStyle.RStroke color='#0000ff' width={3} />
							<RStyle.RFill color='rgba(0, 0, 0, 0.75)' />
						</RStyle.RStyle>

						{drawType === 'Polygon' && <RInteraction.RDraw type={'Polygon'} />}

						{drawType === 'Circle' && <RInteraction.RDraw type={'Circle'} />}

						{drawType === 'LineString' && <RInteraction.RDraw type={'LineString'} />}

						

						

						<RInteraction.RModify />
					</RLayerVector>
				</RMap>

				<div
					className='flex flex-col gap-2'
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',

						fontSize: '13px',
						zIndex: 1000, // Ensure button is above map layers
					}}
				>
					<button
						onClick={() => handleDrawTypeChange('Circle')}
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						Draw Circle
					</button>
					<button
						onClick={() => handleDrawTypeChange('Polygon')}
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						Draw Polygon
					</button>
					<button
						onClick={() => handleDrawTypeChange('LineString')}
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						Draw Line
					</button>
				</div>

				<div
					className='flex flex-col gap-2'
					style={{
						position: 'absolute',
						top: '145px',
						right: '10px',
						fontSize: '13px',
						zIndex: 1000, // Ensure button is above map layers
					}}
				>
					<button
						onClick={toggleMarkerMode}
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						{addMarkerMode ? 'Disable Add Marker' : 'Enable Add Marker'}
					</button>
					<button
						onClick={clearMarkers}
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					>
						Clear All Markers
					</button>

					
				</div>
			</div>

			<div className='flex  gap-3 justify-between m-3'>
				<div className='mx-0 my-0 p-3 bg-gray-100 rounded shadow-md'>
					<p className='text-sm text-gray-700'>
						Last clicked location:{' '}
						<strong>{`${loc[1].toFixed(3)} : ${loc[0].toFixed(3)}`}</strong>
					</p>
				</div>
				<div className='mx-0 my-0 p-3 bg-gray-100 rounded shadow-md'>
					<p className='text-sm text-gray-700'>
						Hover Coordinates:{' '}
						<strong>
							{hoverCoords[1].toFixed(4)}, {hoverCoords[0].toFixed(4)}
						</strong>
					</p>
				</div>
			</div>

			<div className='flex  flex-col p-4 pt-0 justify-center items-center h-full'>
				<h2 className='text-2xl font-bold mb-7 pt-0 text-center'>
					Application Capabilities
				</h2>
				<div className='overflow-x-auto'>
					<table className='table-auto border-collapse border border-gray-300'>
						<thead className='bg-gray-100'>
							<tr>
								<th className='px-4 py-2 text-left'>Functionality</th>
								<th className='px-4 py-2 text-left'>Description</th>
							</tr>
						</thead>
						<tbody className='text-gray-700'>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Custom Zoom Slider</td>
								<td className='border px-4 py-2'>
									Allows users to zoom in and out of the map with a customized
									slider.
								</td>
							</tr>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Zoom Liner</td>
								<td className='border px-4 py-2'>
									Provides a linear representation of zoom levels for easy
									navigation.
								</td>
							</tr>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Current Location Marker</td>
								<td className='border px-4 py-2'>
									Displays a marker at the user's current location for reference.
								</td>
							</tr>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Previous Click Location</td>
								<td className='border px-4 py-2'>
									Shows the coordinates of the last clicked location on the map.
								</td>
							</tr>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Adding Multiple Markers</td>
								<td className='border px-4 py-2'>
									Enables users to add multiple markers by clicking on the map.
								</td>
							</tr>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Delete Markers on Double Click</td>
								<td className='border px-4 py-2'>
									To delete a marker, first disable the 'Add Marker' button, then
									double-click on the marker.
								</td>
							</tr>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Enable/Disable Marker Mode</td>
								<td className='border px-4 py-2'>
									Provides a button to toggle between adding and disabling
									markers.
								</td>
							</tr>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Clear All Markers</td>
								<td className='border px-4 py-2'>
									Offers a button to remove all markers from the map.
								</td>
							</tr>
							<tr className='hover:bg-gray-100'>
								<td className='border px-4 py-2'>Draw and Modify Shapes</td>
								<td className='border px-4 py-2'>
									Supports drawing and modifying various shapes like polygons,
									circles, and lines.
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}
